import { Button } from "@/components/ui/button";
import { useState } from "react";

const steps = [
  ["Memory stored", "A useful decision is captured."],
  ["Memory found", "Relevant context is retrieved."],
  ["Relevance judged", "The suggestion is checked against the current task."],
  ["Memory applied", "The context helps with the work."],
  ["Memory corrected", "You keep, edit, or reject it."],
];
export default function MemoryLoop() {
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<"keep" | "edit" | "reject" | null>(null);
  const [title, detail] = steps[step];
  return (
    <section
      className="post-interaction my-8 rounded-2xl border bg-card p-5 text-card-foreground shadow-sm"
      aria-label="Memory loop"
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {steps.map(([label], index) => (
          <Button
            type="button"
            variant={index === step ? "secondary" : "ghost"}
            className="h-8 rounded-full px-3 text-xs"
            aria-current={index === step ? "step" : undefined}
            onClick={() => setStep(index)}
          >
            {index + 1}. {label}
          </Button>
        ))}
      </div>
      <div className="rounded-xl bg-muted p-4">
        <strong>{title}</strong>
        <p className="mb-0 mt-1 text-sm text-muted-foreground">{detail}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => setStep((value) => Math.min(value + 1, steps.length - 1))}
          disabled={step === steps.length - 1}
        >
          {step === steps.length - 1 ? "Loop complete" : "Next step"}
        </Button>
        {step === steps.length - 1 && (
          <>
            <Button
              variant={decision === "keep" ? "secondary" : "outline"}
              onClick={() => setDecision("keep")}
            >
              Keep
            </Button>
            <Button
              variant={decision === "edit" ? "secondary" : "outline"}
              onClick={() => setDecision("edit")}
            >
              Edit
            </Button>
            <Button
              variant={decision === "reject" ? "secondary" : "ghost"}
              onClick={() => setDecision("reject")}
            >
              Reject
            </Button>
          </>
        )}
      </div>
      <p className="mb-0 mt-3 text-sm text-muted-foreground" role="status">
        {decision === "keep"
          ? "Kept. You remain in control of what becomes durable memory."
          : decision === "edit"
            ? "Edit selected. Review the memory before keeping it."
            : decision === "reject"
              ? "Rejected. This memory will not be used."
              : `Step ${step + 1} of ${steps.length}`}
      </p>
    </section>
  );
}
