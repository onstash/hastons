import { createChat } from "@shadcn/helpers/tanstack-ai";
import { useChat } from "@tanstack/ai-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const answers = [
  "Better instructions",
  "A stronger model",
  "Access to a live weather service",
  "More conversation history",
] as const;
const scriptedChat = createChat()
  .user("Will I need an umbrella in London tomorrow?")
  .assistant("I understand the question, but I cannot check live weather yet.")
  .user("Better instructions")
  .assistant(
    "Clearer instructions help me understand the request, but they do not give me live weather data.",
  )
  .user("A stronger model")
  .assistant(
    "A stronger model may reason better, but it still needs a source for tomorrow’s forecast.",
  )
  .user("Access to a live weather service")
  .assistant(({ writer }) =>
    writer
      .text("Exactly. I need access to a live weather service outside this conversation.")
      .sleep(400)
      .text(
        "That connection lets an assistant call a tool, receive the result, and answer with current information.",
      ),
  )
  .user("More conversation history")
  .assistant(
    "More history gives me context about you. It does not tell me what the weather will be.",
  );

export default function McpWeatherPuzzle() {
  const { messages, append, status } = useChat({
    threadId: "mcp-weather-puzzle",
    initialMessages: scriptedChat.get(2),
    connection: scriptedChat.transport({ delayMs: 30 }),
  });
  const [choice, setChoice] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const busy = status === "submitted" || status === "streaming";
  const choose = (answer: string) => {
    if (busy || correct) return;
    setChoice(answer);
    if (answer === "Access to a live weather service") setCorrect(true);
    const next = scriptedChat.next(messages as never);
    if (next) void append(next as never);
  };
  return (
    <section className="post-interaction my-8 text-foreground" aria-labelledby="mcp-puzzle-title">
      <h3 id="mcp-puzzle-title">What would let the assistant answer?</h3>
      <p>The assistant understands the question. Choose what it needs next.</p>
      <div
        className="mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5"
        data-chat-demo="mcp-weather"
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
            <small className="block text-xs text-muted-foreground">Interactive simulation</small>
          </div>
        </header>
        <div className="grid gap-4 p-5" aria-live="polite" aria-busy={busy}>
          {messages.map((message) => (
            <div
              data-chat-message="true"
              data-chat-role={message.role}
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto rounded-br-sm bg-foreground text-background" : "rounded-bl-sm bg-muted text-foreground"}`}
              key={message.id}
            >
              <p className="m-0">
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.content)
                  .join("")}
              </p>
            </div>
          ))}
          {busy && (
            <p className="m-0 text-sm text-muted-foreground" role="status">
              Assistant is thinking…
            </p>
          )}
        </div>
        <div
          className="grid gap-2 border-t px-4 py-4"
          role="group"
          aria-label="What would let the assistant answer?"
        >
          <p className="m-0 text-xs font-medium text-muted-foreground">Choose an answer</p>
          {answers.map((answer) => (
            <Button
              type="button"
              variant={
                choice === answer && correct
                  ? "default"
                  : choice === answer
                    ? "secondary"
                    : "outline"
              }
              className="h-auto justify-start whitespace-normal px-4 py-3 text-left"
              aria-pressed={choice === answer}
              onClick={() => choose(answer)}
              disabled={busy || correct}
              key={answer}
            >
              {answer}
              {choice === answer && correct ? " ✓" : ""}
            </Button>
          ))}
          <p className="m-0 text-xs text-muted-foreground" role="status">
            {busy
              ? "The assistant is responding…"
              : correct
                ? "You found the missing capability."
                : choice
                  ? "Not quite. Try another possibility."
                  : "Choose one possibility."}
          </p>
        </div>
      </div>
    </section>
  );
}
