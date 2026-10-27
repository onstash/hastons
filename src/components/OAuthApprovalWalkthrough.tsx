import { Button } from "@/components/ui/button";
import { useState } from "react";

const stages = ["Request", "Sign in", "Review", "Connect"];

export default function OAuthApprovalWalkthrough() {
  const [stage, setStage] = useState(0);
  const [approved, setApproved] = useState<boolean | null>(null);
  const connected = approved === true;
  const advance = () => setStage((current) => Math.min(current + 1, 2));
  const reset = () => {
    setStage(0);
    setApproved(null);
  };

  return (
    <section
      className="post-interaction my-8 text-foreground"
      aria-labelledby="oauth-walkthrough-title"
    >
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5">
        <header className="border-b px-5 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Permission flow</p>
              <h3 id="oauth-walkthrough-title" className="m-0 text-base">
                Let the assistant reach your notes
              </h3>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              Simulation
            </span>
          </div>
          <ol className="flex items-center gap-1" aria-label="Authorization progress">
            {stages.map((label, index) => (
              <li className="flex min-w-0 flex-1 items-center gap-1" key={label}>
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${index <= stage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {index < stage || connected ? "✓" : index + 1}
                </span>
                <span
                  className={`truncate text-xs ${index <= stage ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
                {index < stages.length - 1 && (
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </header>
        <div className="p-5" aria-live="polite">
          {stage === 0 && (
            <div>
              <p className="mt-0 text-sm text-muted-foreground">
                The assistant wants to search your Life OS notes for relevant context.
              </p>
              <div className="rounded-xl border bg-muted p-4">
                <strong className="text-sm">Requested access</strong>
                <ul className="mb-0 mt-3 grid gap-2 pl-5 text-sm">
                  <li>Search notes you choose to share</li>
                  <li>Read matching results for this conversation</li>
                  <li>No permission to edit or delete notes</li>
                </ul>
              </div>
              <Button className="mt-4" onClick={advance}>
                Continue to sign in
              </Button>
            </div>
          )}
          {stage === 1 && (
            <div>
              <p className="mt-0 text-sm text-muted-foreground">
                Before access can be granted, the service needs to know who is asking.
              </p>
              <div className="rounded-xl border p-4">
                <strong className="text-sm">Life OS sign-in</strong>
                <p className="mb-0 mt-1 text-sm text-muted-foreground">
                  This is where your identity is established. The assistant does not receive your
                  password.
                </p>
              </div>
              <Button className="mt-4" onClick={advance}>
                Sign in and review
              </Button>
            </div>
          )}
          {stage === 2 && (
            <div>
              <p className="mt-0 text-sm text-muted-foreground">
                You decide what the assistant can do. Nothing is connected until you approve it.
              </p>
              <div className="rounded-xl border bg-muted p-4">
                <strong className="text-sm">Assistant wants to connect</strong>
                <p className="mb-3 mt-1 text-sm text-muted-foreground">
                  Search your notes for this conversation.
                </p>
                <div className="grid gap-2 text-sm">
                  <span>✓ Read matching notes</span>
                  <span>× Cannot edit or delete notes</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setApproved(true);
                    setStage(3);
                  }}
                >
                  Allow access
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setApproved(false);
                    setStage(3);
                  }}
                >
                  Not now
                </Button>
              </div>
            </div>
          )}
          {stage === 3 && (
            <div className="rounded-xl border bg-muted p-4">
              <strong className="text-sm">
                {connected ? "Connected for this task" : "Connection declined"}
              </strong>
              <p className="mb-0 mt-1 text-sm text-muted-foreground">
                {connected
                  ? "The assistant can now make an authorized request for relevant notes."
                  : "The assistant cannot search your notes without your permission."}
              </p>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="m-0 text-xs text-muted-foreground" role="status">
              {stage === 3
                ? connected
                  ? "Permission granted"
                  : "No permission granted"
                : `Step ${stage + 1} of 4`}
            </p>
            {stage > 0 && (
              <Button variant="ghost" onClick={reset}>
                Start over
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
