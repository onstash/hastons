import { Button } from "@/components/ui/button";
import { useState } from "react";

const chats = [
  "The idea I had on Monday",
  "How to plan next quarter",
  "That debugging conversation",
  "A book I wanted to remember",
];

export default function ChatRecallTest() {
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const toggle = (chat: string) =>
    setSelected((current) =>
      current.includes(chat) ? current.filter((item) => item !== chat) : [...current, chat],
    );

  return (
    <section className="my-12 text-foreground" aria-labelledby="recall-test-title">
      <h2 id="recall-test-title">How much of your chat history do you remember?</h2>
      <p>Select the conversations you would recognise if they appeared again.</p>
      <div className="mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xl shadow-black/5">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <span
            className="grid size-8 place-items-center rounded-full bg-foreground text-background"
            aria-hidden="true"
          >
            ✦
          </span>
          <div>
            <strong className="block text-sm">Chat history</strong>
            <small className="block text-xs text-muted-foreground">Recent conversations</small>
          </div>
        </header>
        <div className="grid gap-1 p-3" role="group" aria-label="Illustrative chat history">
          {chats.map((chat) => {
            const isSelected = selected.includes(chat);
            return (
              <Button
                key={chat}
                variant="ghost"
                className={`h-11 w-full justify-between px-3 text-left ${isSelected ? "bg-muted" : ""}`}
                aria-pressed={isSelected}
                onClick={() => toggle(chat)}
              >
                <span>{chat}</span>
                <span aria-hidden="true">›</span>
              </Button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 border-t p-3">
          <Button onClick={() => setRevealed(true)} disabled={!selected.length}>
            Reveal result
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSelected([]);
              setRevealed(false);
            }}
          >
            Reset
          </Button>
        </div>
        {revealed && (
          <div className="mx-3 mb-3 rounded-xl border bg-muted p-4 text-sm" role="status">
            <strong>
              You recognised {selected.length} of {chats.length} conversations.
            </strong>
            <p className="mb-0 mt-1">
              Useful context can exist without being available when you need it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
