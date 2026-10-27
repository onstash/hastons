import { Button } from "@/components/ui/button";
import { useChat } from "@tanstack/ai-react";
import { useRef, useState } from "react";

const initialMessages = [
  {
    id: "user-1",
    role: "user",
    parts: [
      {
        type: "text",
        content: "I wrote something useful last week. Can you find it?",
      },
    ],
  },
  {
    id: "assistant-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        content: "I can help, but I can’t see your notes yet. Connect them and I can look.",
      },
    ],
  },
];

export default function ContextAccessChat() {
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState(false);
  const chat = useChat({
    threadId: "context-access-demo",
    initialMessages,
    fetcher: async () => ({}) as never,
  } as never);
  const messages = chat.messages as unknown as Array<{
    id: string;
    role: string;
    parts?: Array<{ content?: string; text?: string }>;
  }>;
  const messagesRef = useRef(messages);
  const add = (role: string, content: string) => {
    const next = [
      ...messagesRef.current,
      { id: `${role}-${Date.now()}`, role, parts: [{ type: "text", content }] },
    ];
    messagesRef.current = next;
    chat.setMessages(next as never);
  };
  const search = () => {
    if (searched) return;
    setSearched(true);
    add("user", "Connect my notes");
    setTimeout(() => add("assistant", "Searching your notes…"), 100);
    setTimeout(
      () =>
        add(
          "assistant",
          "I found a note from last week: “Keep the useful idea, not the whole history.”",
        ),
      850,
    );
  };
  return (
    <div className="my-12 text-foreground" data-chat-demo="context-access">
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <span
            className="grid size-8 place-items-center rounded-full bg-foreground text-background"
            aria-hidden="true"
          >
            ✦
          </span>
          <div>
            <strong className="block text-sm">Assistant</strong>
            <small className="block text-xs text-muted-foreground">Conversation</small>
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
        {!searched && (
          <div className="border-t px-5 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Suggested action</p>
            <Button
              type="button"
              data-suggestion="true"
              onClick={search}
              variant="outline"
              className="h-10 rounded-full px-4 text-sm font-normal"
            >
              Then look through my notes
            </Button>
          </div>
        )}
        <form
          className="flex gap-2 border-t p-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!input.trim()) return;
            add("user", input.trim());
            setInput("");
          }}
        >
          <label className="sr-only" htmlFor="context-demo-input">
            Message the assistant
          </label>
          <input
            className="h-10 min-w-0 flex-1 rounded-full border bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="context-demo-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={searched ? "Continue the conversation…" : "Ask the assistant…"}
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
      </div>
    </div>
  );
}
