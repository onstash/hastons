// Injected by Vite at build time from package.json
declare const __APP_VERSION__: string;
const appVersion =
  typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "unknown";

// Time utility with fallback
const getTime = () =>
  typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();

const usePerformanceAPI =
  typeof performance !== "undefined" && !!performance.now;

function cleanPathname(pathname: string) {
  let pathnameParts = pathname.split("/");
  let cleaned = pathnameParts.join("__").split("__")[0];
  return cleaned;
}

// Extract UTM parameters from URL
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? null,
    utm_medium: params.get("utm_medium") ?? null,
    utm_campaign: params.get("utm_campaign") ?? null,
  };
}

function initTracking() {
  const distinctId = localStorage.getItem("mp_id") || crypto.randomUUID();
  localStorage.setItem("mp_id", distinctId);
  const pageLoadTime = getTime();

  // Track page load
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: `v${appVersion}_page_load_${cleanPathname(window.location.pathname)}`,
      distinctId,
      properties: {
        page: window.location.pathname,
        title: document.title,
        app_version: appVersion,
        ...getUtmParams(),
      },
    }),
  }).catch((err) => console.error("Failed to track page load:", err));

  // Track time spent on exit
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      const timeSpent = Math.round((getTime() - pageLoadTime) / 1000);
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({
          event: `v${appVersion}_time_spent_${cleanPathname(window.location.pathname)}`,
          distinctId,
          properties: {
            page: window.location.pathname,
            duration_seconds: timeSpent,
            timing_api: usePerformanceAPI ? "performance" : "date",
            app_version: appVersion,
            ...getUtmParams(),
          },
        }),
      );
    }
  };

  // Remove previous listener to avoid duplicates on view transitions
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

// Initialize on first load
initTracking();

// Re-initialize on Astro view transitions
document.addEventListener("astro:after-swap", initTracking);
