import type { APIRoute } from "astro";
import Mixpanel from "mixpanel";

// Required for Astro to treat this as a server endpoint
export const prerender = false;

const mixpanel = Mixpanel.init(import.meta.env.MIXPANEL_TOKEN, {
  verbose: true,
});

// ═══════════════════════════════════════════════════════════════════════════
// USER-AGENT PARSING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse browser name and version from user-agent string
 */
function parseBrowser(userAgent: string | null): string {
  if (!userAgent) return "Unknown";

  // Order matters - check more specific patterns first
  const browsers: [RegExp, string][] = [
    [/Edg(?:e|A|iOS)?\/(\d+)/, "Edge"],
    [/OPR\/(\d+)|Opera\/(\d+)/, "Opera"],
    [/Chrome\/(\d+).*Safari/, "Chrome"],
    [/Firefox\/(\d+)/, "Firefox"],
    [/Safari\/(\d+)(?!.*Chrome)/, "Safari"],
    [/MSIE (\d+)|Trident.*rv:(\d+)/, "Internet Explorer"],
  ];

  for (const [regex, name] of browsers) {
    const match = userAgent.match(regex);
    if (match) {
      const version = match[1] || match[2] || "";
      return version ? `${name} ${version}` : name;
    }
  }

  return "Unknown";
}

/**
 * Parse device type from user-agent string
 */
function parseDevice(userAgent: string | null): string {
  if (!userAgent) return "Unknown";

  const ua = userAgent.toLowerCase();

  // Check for tablets first (they often contain "mobile" too)
  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return "Tablet";
  }

  // Check for mobile devices
  if (
    /mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|opera mobi/.test(
      ua,
    )
  ) {
    return "Mobile";
  }

  // Check for Android (without mobile = tablet)
  if (/android/.test(ua)) {
    return "Tablet";
  }

  // Default to desktop
  return "Desktop";
}

/**
 * Parse operating system from user-agent string
 */
function parseOS(userAgent: string | null): string {
  if (!userAgent) return "Unknown";

  const osPatterns: [RegExp, string][] = [
    [/Windows NT 10/, "Windows 10"],
    [/Windows NT 6\.3/, "Windows 8.1"],
    [/Windows NT 6\.2/, "Windows 8"],
    [/Windows NT 6\.1/, "Windows 7"],
    [/Windows/, "Windows"],
    [/Mac OS X (\d+)[._](\d+)/, "macOS"],
    [/Macintosh/, "macOS"],
    [/iPhone OS (\d+)/, "iOS"],
    [/iPad.*OS (\d+)/, "iPadOS"],
    [/Android (\d+)/, "Android"],
    [/Linux/, "Linux"],
    [/CrOS/, "Chrome OS"],
  ];

  for (const [regex, name] of osPatterns) {
    const match = userAgent.match(regex);
    if (match) {
      // Extract version if available
      if (match[1]) {
        const version = match[2] ? `${match[1]}.${match[2]}` : match[1];
        return `${name} ${version}`;
      }
      return name;
    }
  }

  return "Unknown";
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { event } = data;

    if (!event) {
      return new Response(JSON.stringify({ error: "Missing event name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract headers from the browser request
    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");
    // Split referer into chunks of max 205 characters for Mixpanel property limits
    const refererParts: string[] = [];
    if (referer) {
      for (let i = 0; i < referer.length; i += 205) {
        refererParts.push(referer.slice(i, i + 205));
      }
    }
    const acceptLanguage = request.headers.get("accept-language");
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip");
    const origin = request.headers.get("origin");

    const finalData = {
      ...data.properties,

      // Browser/Device info
      $user_agent: userAgent,
      $browser: parseBrowser(userAgent),
      $device: parseDevice(userAgent),
      $os: parseOS(userAgent),

      // Referral tracking
      $referrer: referer,
      refererParts,

      // Geo/Locale
      $locale: acceptLanguage?.split(",")[0],

      // Network
      ip: ip,
      $origin: origin,
    };

    console.log("Mixpanel event", data.event, finalData);
    if (origin?.includes?.("localhost")) {
      return new Response(JSON.stringify({ success: true, dev: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const _mixpanelResponse = mixpanel.track(event, finalData);

    console.log("Mixpanel response", _mixpanelResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mixpanel tracking error:", error);
    return new Response(JSON.stringify({ error: "Failed to track event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
