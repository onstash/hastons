import { Button } from "@/components/ui/button";
import { useState } from "react";

type Stage = "request" | "transport" | "result";

export default function McpConnectionExplainer() {
  const [stage, setStage] = useState<Stage>("request");
  const complete = stage === "result";

  return (
    <section
      className="post-interaction my-10 rounded-2xl border bg-card p-5 text-card-foreground shadow-sm sm:p-6"
      aria-labelledby="mcp-inspector-title"
    >
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Under the hood
        </p>
        <h3 id="mcp-inspector-title" className="mb-2 text-xl font-semibold tracking-tight">
          What actually happens after you allow access?
        </h3>
        <p className="mb-0 text-sm leading-6 text-muted-foreground">
          Watch one request move from the assistant to your Life OS and back.
        </p>
      </div>

      <div className="grid gap-2" aria-live="polite">
        <div
          className={`rounded-xl border p-4 ${stage === "request" ? "border-primary bg-primary/5" : "bg-muted/30"}`}
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            1 · Assistant request
          </p>
          <code className="text-sm">search_life_os_notes({`{ query: "Japan" }`})</code>
        </div>
        {stage !== "request" && (
          <div
            className={`rounded-xl border p-4 ${stage === "transport" ? "border-primary bg-primary/5" : "bg-muted/30"}`}
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              2 · MCP carries the request
            </p>
            <p className="mb-0 text-sm leading-6">
              The shared protocol passes the request to the approved Life OS capability.
            </p>
          </div>
        )}
        {complete && (
          <div className="rounded-xl border border-primary bg-primary/5 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              3 · Life OS result
            </p>
            <p className="mb-0 text-sm leading-6">
              One relevant note returned: “Food and hiking for my October trip.”
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!complete ? (
          <Button
            type="button"
            className="min-h-11"
            onClick={() => setStage(stage === "request" ? "transport" : "result")}
          >
            {stage === "request" ? "Send the request" : "Show the result"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => setStage("request")}
          >
            Run it again
          </Button>
        )}
        <span className="text-sm text-muted-foreground" role="status">
          {stage === "request"
            ? "Waiting to send"
            : stage === "transport"
              ? "Request in transit"
              : "Answer returned"}
        </span>
      </div>

      <details className="mt-5 border-t pt-4 text-sm">
        <summary className="cursor-pointer font-medium">Technical version</summary>
        <p className="mb-0 mt-3 leading-6 text-muted-foreground">
          MCP is the shared protocol that lets an assistant call an approved tool and receive
          structured results from another service.
        </p>
      </details>
    </section>
  );
}
