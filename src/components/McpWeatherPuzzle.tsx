import { Button } from "@/components/ui/button";
import { useChat } from "@tanstack/ai-react";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

const initialMessages = [
  {
    id: "weather-user",
    role: "user",
    parts: [{ type: "text", content: "Will I need an umbrella in London tomorrow?" }],
  },
  {
    id: "weather-assistant",
    role: "assistant",
    parts: [
      { type: "text", content: "I understand the question, but I cannot check live weather yet." },
    ],
  },
];

const stages = [
  "Better instructions",
  "A stronger model",
  "A weather connection",
  "More conversation history",
] as const;
type Stage = (typeof stages)[number];
const wrongFeedback: Record<Exclude<Stage, "A weather connection">, string> = {
  "Better instructions":
    "Clearer instructions help me understand the request, but they do not give me live weather data.",
  "A stronger model":
    "A stronger model may reason better, but it still needs a source for tomorrow’s forecast.",
  "More conversation history":
    "More history gives me context about you. It does not tell me what the weather will be.",
};

type ChatMessage = { id: string; role: string; parts?: Array<{ content?: string; text?: string }> };

export default function McpWeatherPuzzle() {
  const chat = useChat({
    threadId: "mcp-weather-puzzle",
    initialMessages,
    fetcher: async () => ({}) as never,
  } as never);
  const messages = chat.messages as unknown as ChatMessage[];
  const messagesRef = useRef(messages);
  const [input, setInput] = useState("");
  const [choice, setChoice] = useState<Stage | null>(null);
  const [correct, setCorrect] = useState(false);

  const add = (role: string, content: string) => {
    const next = [
      ...messagesRef.current,
      { id: `${role}-${Date.now()}-${Math.random()}`, role, parts: [{ type: "text", content }] },
    ];
    messagesRef.current = next;
    chat.setMessages(next as never);
  };

  const choose = (stage: Stage) => {
    setChoice(stage);
    add("user", stage);
    if (stage === "A weather connection") {
      setCorrect(true);
      setTimeout(
        () =>
          add("assistant", "Exactly. I need access to a weather source outside this conversation."),
        250,
      );
      setTimeout(
        () =>
          add(
            "assistant",
            "That connection is what lets an assistant call a tool, receive the result, and answer with current information.",
          ),
        900,
      );
      return;
    }
    setTimeout(() => add("assistant", wrongFeedback[stage]), 250);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;
    add("user", message);
    setInput("");
    setTimeout(
      () =>
        add(
          "assistant",
          "I can understand that request, but I still need access to a weather source to answer it.",
        ),
      250,
    );
  };

  return (
    <section className="my-8 text-foreground" aria-labelledby="mcp-puzzle-title">
      <h3 id="mcp-puzzle-title">What would let the assistant answer?</h3>
      <p>The assistant understands the question. Choose what it needs next.</p>
      <div
        className="mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5"
        data-chat-demo="mcp-weather"
      >
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <span
            className="grid size-8 place-items-center rounded-full bg-foreground text-background"
            aria-hidden="true"
          >
            ✦
          </span>
          <div>
            <strong className="block text-sm">Assistant</strong>
            <small className="block text-xs text-muted-foreground">Interactive simulation</small>
          </div>
        </header>
        <div className="grid gap-4 p-5" aria-live="polite">
          {messages.map((message) => (
            <div
              data-chat-message="true"
              data-chat-role={message.role}
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "ml-auto rounded-br-sm bg-foreground text-background" : "rounded-bl-sm bg-muted text-foreground"}`}
              key={message.id}
            >
              <p className="m-0">
                {message.parts?.map((part) => part.content ?? part.text).join("")}
              </p>
            </div>
          ))}
        </div>
        <div
          className="grid gap-2 border-t px-4 py-4"
          role="group"
          aria-label="What would let the assistant answer?"
        >
          <p className="m-0 text-xs font-medium text-muted-foreground">Choose an answer</p>
          {stages.map((stage) => (
            <Button
              type="button"
              variant={
                choice === stage
                  ? stage === "A weather connection" && correct
                    ? "default"
                    : "secondary"
                  : "outline"
              }
              className="h-auto justify-start whitespace-normal px-4 py-3 text-left"
              aria-pressed={choice === stage}
              onClick={() => choose(stage)}
              key={stage}
            >
              {stage}
              {stage === "A weather connection" && correct ? " ✓" : ""}
            </Button>
          ))}
          {choice && (
            <p className="m-0 text-xs text-muted-foreground" role="status">
              {correct
                ? "You found the missing capability."
                : "Not quite. Try another possibility."}
            </p>
          )}
        </div>
        <form className="flex gap-2 border-t p-3" onSubmit={submit}>
          <label className="sr-only" htmlFor="weather-puzzle-input">
            Message the assistant
          </label>
          <input
            className="h-10 min-w-0 flex-1 rounded-full border bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="weather-puzzle-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask the assistant…"
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0"
            aria-label="Send message"
          >
            ↑
          </Button>
        </form>
        {correct && (
          <div className="mx-4 mb-4 rounded-xl border bg-muted p-4 text-sm">
            <strong>The missing piece is access.</strong>
            <p className="mb-0 mt-1">
              The assistant needs a way to reach information outside the chat. Later, we will give
              this connection a name.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
