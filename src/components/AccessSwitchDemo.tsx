import { Button } from "@/components/ui/button";
import { Bot, Lock, LockOpen, NotebookText } from "lucide-react";
import { useEffect, useState } from "react";

/*
 * Access demo — decided from /proto/access-flow (two rounds)
 * - Direction: "Switch". A diagram (Assistant, MCP connection, Life OS) with one permission
 *   switch. The reader asks, gets refused, flips the switch, asks again, and can turn it back off.
 * - Motion: the dot travels 650ms per leg with ease-in-out; the search pause is 900ms.
 * - The separate MCP explainer further down the note stays, because this shows the protocol
 *   only as a dot on a line.
 * - Rejected, round 1: Split (a scripted chat plus the explainer; same request played twice),
 *   Inline (one chat with a tool-call trace; grew ~120px on mobile, left "Where MCP fits" bare).
 * - Rejected, round 2: Scopes (per-shelf switches; tallest, needs working out), Log (printed
 *   protocol lines; too technical for the essay), Twin (side-by-side lanes; the reader never
 *   grants anything themselves).
 */

type Stage = "idle" | "toGate" | "blocked" | "toStore" | "searching" | "returning" | "answered";

const MOVE_MS = 650;

// What happens after each stage, and how long it lasts.
const next: Partial<Record<Stage, [Stage, number]>> = {
  toGate: ["blocked", MOVE_MS],
  toStore: ["searching", MOVE_MS],
  searching: ["returning", 900],
  returning: ["answered", MOVE_MS],
};

const status: Record<Stage, string> = {
  idle: "Nothing sent yet.",
  toGate: "The assistant asks MCP for your notes…",
  blocked: "Stopped at the connection. You have not allowed access.",
  toStore: "The assistant asks MCP for your notes…",
  searching: 'Life OS runs search_life_os_notes({ query: "Japan" })',
  returning: "One note travels back.",
  answered: "One request out, one note back. Nothing else left Life OS.",
};

export default function AccessSwitchDemo() {
  const [allowed, setAllowed] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const running = stage in next;

  useEffect(() => {
    const step = next[stage];
    if (!step) return;
    const timer = setTimeout(() => setStage(step[0]), step[1]);
    return () => clearTimeout(timer);
  }, [stage]);

  const position =
    stage === "toGate"
      ? "translate-x-1/2"
      : stage === "toStore" || stage === "searching"
        ? "translate-x-full"
        : "translate-x-0";
  const dotVisible = running;
  const reply =
    stage === "blocked"
      ? "I can’t see your notes, so I don’t know."
      : stage === "answered"
        ? "You decided to focus the Japan trip on food and hiking."
        : null;

  return (
    <section
      className="post-interaction my-10 text-foreground"
      aria-label="Access switch demo"
      data-chat-demo="context-access"
    >
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="notes-access-switch" className="text-sm font-medium">
            Allow access to my notes
          </label>
          <button
            id="notes-access-switch"
            type="button"
            role="switch"
            aria-checked={allowed}
            disabled={running}
            onClick={() => {
              setAllowed((value) => !value);
              setStage("idle");
            }}
            className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 before:absolute before:-inset-2 disabled:opacity-60 ${allowed ? "border-primary bg-primary" : "border-input bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-5.5 rounded-full shadow-sm transition-transform duration-200 ease-out ${allowed ? "translate-x-5 bg-primary-foreground" : "bg-background"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Diagram: assistant, the MCP connection with its gate, Life OS. */}
        <div className="pointer-events-none mt-8 select-none" aria-hidden="true">
          <div className="relative mx-6 flex items-center justify-between">
            <div
              className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t transition-colors duration-300 ${allowed ? "border-foreground" : "border-dashed border-muted-foreground/50"}`}
            />
            <div
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-transform ease-in-out ${running ? "duration-[650ms]" : "duration-0"} ${position}`}
            >
              <span
                className={`block size-3 -translate-x-1/2 rounded-full bg-foreground transition-opacity duration-150 ${dotVisible ? "opacity-100" : "opacity-0"}`}
              />
            </div>
            <span className="relative -ml-6 grid size-12 place-items-center rounded-xl border bg-background">
              <Bot className="size-5" />
            </span>
            <span
              className={`relative grid size-9 place-items-center rounded-full border transition-colors duration-300 ${allowed ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground"} ${stage === "blocked" ? "border-destructive text-destructive" : ""}`}
            >
              {allowed ? <LockOpen className="size-4" /> : <Lock className="size-4" />}
            </span>
            <span
              className={`relative -mr-6 grid size-12 place-items-center rounded-xl border bg-background transition-colors duration-300 ${stage === "searching" ? "border-primary" : ""}`}
            >
              <NotebookText className="size-5" />
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
            <span>Assistant</span>
            <span className="text-center">MCP connection</span>
            <span className="text-right">Life OS</span>
          </div>
        </div>

        <p
          className="m-0 mt-5 min-h-12 text-sm leading-relaxed text-muted-foreground"
          role="status"
        >
          {status[stage]}
        </p>

        <div className="mt-4 grid min-h-40 content-start gap-2 rounded-xl bg-muted/50 p-3">
          <p
            className="m-0 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-sm text-background"
            data-chat-message="true"
            data-chat-role="user"
          >
            What did I decide about Japan?
          </p>
          {reply && (
            <p
              className="m-0 w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300"
              aria-live="polite"
              data-chat-message="true"
              data-chat-role="assistant"
            >
              {reply}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            className="h-11 px-4"
            disabled={running}
            onClick={() => setStage(allowed ? "toStore" : "toGate")}
          >
            {running ? "Asking…" : stage === "idle" ? "Ask the question" : "Ask again"}
          </Button>
          {stage === "blocked" && (
            <span className="text-sm text-muted-foreground">Flip the switch, then ask again.</span>
          )}
          {stage === "answered" && (
            <span className="text-sm text-muted-foreground">Turn it off and ask once more.</span>
          )}
        </div>
      </div>
    </section>
  );
}
