import { createChat } from "@shadcn/helpers/tanstack-ai";
import { useChat } from "@tanstack/ai-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type TextMessage = { id: string; role: string; parts: Array<{ type: string; content: string }> };

const scriptedChat = createChat()
  .user("I wrote something useful last week. Can you find it?")
  .assistant("I can help, but I can’t see your notes yet. Connect them and I can look.")
  .user("Connect my notes")
  .assistant(({ writer }) => {
    writer
      .text("I’m checking what I can access…")
      .sleep(500)
      .text("I found a note from last week: “Keep the useful idea, not the whole history.”");
  });

export default function ContextAccessChat() {
  const { messages, append, status } = useChat({
    threadId: "context-access-demo",
    initialMessages: scriptedChat.get(2),
    connection: scriptedChat.transport({ delayMs: 35 }),
  });
  const [connected, setConnected] = useState(false);
  const busy = status === "submitted" || status === "streaming";
  const connectNotes = () => {
    if (busy || connected) return;
    const next = scriptedChat.next(messages as never);
    if (!next) return;
    setConnected(true);
    void append(next as never);
  };
  const text = (message: TextMessage) =>
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.content)
      .join("");

  return (
    <div className="post-interaction my-12 text-foreground">
      <div
        className="mx-auto max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5"
        data-chat-demo="context-access"
      >
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <span
            className="grid size-8 place-items-center rounded-full bg-foreground text-background text-xs font-semibold"
            aria-hidden="true"
          >
            AI
          </span>
          <div>
            <strong className="block text-sm">Assistant</strong>
            <small className="block text-xs text-muted-foreground">Context access</small>
          </div>
        </header>
        <div className="grid gap-4 p-5" aria-live="polite" aria-busy={busy}>
          {(messages as unknown as TextMessage[]).map((message) => (
            <div
              data-chat-message="true"
              data-chat-role={message.role}
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto rounded-br-sm bg-foreground text-background" : "rounded-bl-sm bg-muted text-foreground"}`}
              key={message.id}
            >
              <p className="m-0">{text(message)}</p>
            </div>
          ))}
          {busy && (
            <p className="m-0 text-sm text-muted-foreground" role="status">
              Assistant is thinking…
            </p>
          )}
        </div>
        <div className="border-t px-5 py-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Suggested action</p>
          <Button
            type="button"
            onClick={connectNotes}
            variant="outline"
            disabled={busy || connected}
            className="min-h-10 rounded-full px-4 text-sm font-normal"
          >
            {connected ? "Notes connected" : "Connect my notes"}
          </Button>
        </div>
        <form className="flex gap-2 border-t p-3" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="context-demo-input">
            Message the assistant
          </label>
          <input
            className="h-10 min-w-0 flex-1 rounded-full border bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="context-demo-input"
            placeholder="This demo follows one scripted path"
            disabled
          />
          <Button
            type="submit"
            className="h-10 w-10 shrink-0 rounded-full"
            aria-label="Send message"
            disabled
          >
            ↑
          </Button>
        </form>
      </div>
    </div>
  );
}
