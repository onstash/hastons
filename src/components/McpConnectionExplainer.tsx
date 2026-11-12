import { ArrowDownLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { type ReactNode, useState } from "react";

/*
 * MCP explainer — decided from /proto/mcp-explainer (two rounds)
 * - Direction: "Tags". A finished chat transcript for the Japan question; one toggle swaps every
 *   label, and the request/connection/result rows, between plain words and technical names.
 * - Both wordings are always laid out on top of each other, so the toggle never changes height.
 *   The swap is a 200ms opacity cross-fade.
 * - Five parts, not the note's four-part path: user message, tool call, MCP server, tool result,
 *   assistant message.
 * - Rejected, round 1: Stepper (the old three-step playback; repeated what the access switch
 *   already shows), Payload (raw request/response with tabs; tallest, most technical),
 *   Figure (static table; nothing to do).
 * - Rejected, round 2: Relabel (same toggle on a plain list; not a chat), Ask (four tappable
 *   questions; slowest to get through), Server (reader plays Life OS; needs a moment to grasp).
 */

// Lays out both wordings on top of each other so nothing moves when the toggle flips.
function Swap({
  technical,
  plain,
  tech,
}: {
  technical: boolean;
  plain: ReactNode;
  tech: ReactNode;
}) {
  return (
    <span className="grid">
      <span
        className={`col-start-1 row-start-1 transition-opacity duration-200 ${technical ? "invisible opacity-0" : "opacity-100"}`}
      >
        {plain}
      </span>
      <span
        className={`col-start-1 row-start-1 transition-opacity duration-200 ${technical ? "opacity-100" : "invisible opacity-0"}`}
      >
        {tech}
      </span>
    </span>
  );
}

const tag = "m-0 mb-1 text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase";
const code = "font-mono text-xs break-words";

export default function McpConnectionExplainer() {
  const [technical, setTechnical] = useState(true);

  return (
    <section
      className="post-interaction my-10 text-foreground"
      aria-label="The exchange, in plain words or technical names"
    >
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-background text-xs font-semibold"
            aria-hidden="true"
          >
            AI
          </span>
          <strong className="min-w-0 flex-1 text-sm">Assistant</strong>
          <label htmlFor="mcp-names-switch" className="text-xs font-medium text-muted-foreground">
            Technical names
          </label>
          <button
            id="mcp-names-switch"
            type="button"
            role="switch"
            aria-checked={technical}
            onClick={() => setTechnical((value) => !value)}
            className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 before:absolute before:-inset-2 ${technical ? "border-primary bg-primary" : "border-input bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-5.5 rounded-full shadow-sm transition-transform duration-200 ease-out ${technical ? "translate-x-5 bg-primary-foreground" : "bg-background"}`}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className="grid gap-4 p-4 sm:p-5" aria-live="polite">
          <div className="ml-auto max-w-[85%] text-right">
            <p className={tag}>
              <Swap technical={technical} plain="Your question" tech="User message" />
            </p>
            <p className="m-0 inline-block rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-left text-sm text-background">
              What did I decide about Japan?
            </p>
          </div>

          <div className="grid gap-2 rounded-xl border border-dashed p-3">
            <div className="flex gap-3">
              <ArrowUpRight
                className="mt-4 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className={tag}>
                  <Swap technical={technical} plain="The request" tech="Tool call" />
                </p>
                <p className="m-0 text-sm">
                  <Swap
                    technical={technical}
                    plain="Search my notes for “Japan”."
                    tech={
                      <span className={code}>
                        tools/call search_life_os_notes {'{ "query": "Japan" }'}
                      </span>
                    }
                  />
                </p>
              </div>
            </div>
            <div className="flex gap-3 border-y border-dashed py-2">
              <ShieldCheck
                className="mt-4 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className={tag}>
                  <Swap technical={technical} plain="Approved connection" tech="MCP server" />
                </p>
                <p className="m-0 text-sm">
                  <Swap
                    technical={technical}
                    plain="Life OS lets the request in, because you said yes."
                    tech="The Life OS MCP server checks your authorisation, then runs the tool."
                  />
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ArrowDownLeft
                className="mt-4 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className={tag}>
                  <Swap technical={technical} plain="Saved context" tech="Tool result" />
                </p>
                <p className="m-0 text-sm">
                  <Swap
                    technical={technical}
                    plain="One note comes back: “Food and hiking for my October trip.”"
                    tech={
                      <span className={code}>
                        result.content: “Food and hiking for my October trip.”
                      </span>
                    }
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[85%]">
            <p className={tag}>
              <Swap technical={technical} plain="Useful answer" tech="Assistant message" />
            </p>
            <p className="m-0 inline-block rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm">
              You decided to focus the Japan trip on food and hiking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
