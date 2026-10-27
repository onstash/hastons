import { Button } from "@/components/ui/button";
import { useState } from "react";

const steps = [
  ["Me", "How do I build an MCP server?"],
  ["Agent", "What does the server need to do first?"],
  ["Me", "Receive a request."],
  ["Agent", "What must the request contain?"],
  ["Me", "Enough information to understand the operation and respond."],
];
export default function SocraticCodingReplay() {
  const [shown, setShown] = useState(1);
  return (
    <section
      className="post-interaction my-8 rounded-2xl border bg-card p-5 text-card-foreground shadow-sm"
      aria-label="Socratic coding replay"
    >
      <div className="grid gap-3">
        {steps.slice(0, shown).map(([speaker, text], index) => (
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${speaker === "Me" ? "ml-auto bg-foreground text-background" : "bg-muted"}`}
            key={`${speaker}-${index}`}
          >
            <p className="mb-1 text-xs font-medium opacity-70">{speaker}</p>
            {text}
          </div>
        ))}
      </div>
      {shown < steps.length && (
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setShown((value) => Math.min(value + 1, steps.length))}
        >
          Continue the lesson
        </Button>
      )}
      {shown === steps.length && (
        <p className="mb-0 mt-4 text-sm text-muted-foreground" role="status">
          The agent guided the reasoning instead of skipping straight to generated code.
        </p>
      )}
    </section>
  );
}
