import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StatefulStatelessDemo() {
  const [mode, setMode] = useState<"without" | "with">("without");
  const connected = mode === "with";
  return (
    <section
      className="post-interaction my-12 text-foreground"
      aria-labelledby="context-demo-title"
    >
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          See the difference
        </p>
        <h2 id="context-demo-title" className="mb-3">
          Can your assistant find the conversation?
        </h2>
        <p className="text-muted-foreground">
          Imagine asking about an idea you discussed last week.
        </p>
      </div>
      <div className="my-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          Your chat history
        </p>
        <div className="flex items-center gap-3 rounded-xl border bg-muted p-4">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          <div>
            <strong className="block text-sm">Planning a Japan trip</strong>
            <small className="text-xs text-muted-foreground">
              Last Tuesday · food, hiking, October
            </small>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5">
        <div
          className="flex gap-1 border-b bg-muted p-2"
          role="tablist"
          aria-label="Choose how the assistant can access your context"
        >
          {(["without", "with"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              variant={mode === value ? "secondary" : "ghost"}
              className="min-h-10"
              onClick={() => setMode(value)}
            >
              {value === "without" ? "Without access" : "With access"}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 p-8" aria-live="polite">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-foreground px-4 py-3 text-sm text-background">
            Continue the conversation about the trip.
          </div>
          {connected && (
            <div className="text-center text-xs text-primary" role="status">
              <span aria-hidden="true">● </span>Finding relevant context…
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm transition-colors ${connected ? "bg-primary/10 text-foreground" : "bg-muted text-foreground"}`}
          >
            {connected
              ? "I found it. You were planning a Japan trip for October, focused on food and hiking."
              : "Which trip are you talking about?"}
          </div>
        </div>
        <p className="m-0 border-t p-4 text-sm text-muted-foreground" role="status">
          {connected
            ? "With access: the assistant can reach the relevant context."
            : "Without access: the conversation still exists, but the assistant cannot reach it."}
        </p>
      </div>
      <details className="mt-4 border-t pt-4 text-sm text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-foreground">
          For technical readers: how the connection works
        </summary>
        <p>
          MCP is the connector between an AI client and an external application. It lets the client
          discover and invoke structured tools that can search or act on Life OS.
        </p>
        <p>
          The protocol’s session behavior is separate from application memory. The application can
          still return explicit handles, such as <code>browser_id</code>, for later requests.
        </p>
      </details>
    </section>
  );
}
