import { useState } from "react";

/*
 * Recall test — decided from /proto/recall-test
 * - Direction: "Estimate". One slider and a 100-dot grid; the reader states a number, no test.
 * - Starts at 20 with a "drag to your honest guess" hint; the verdict line appears on first drag.
 * - Rejected: Ticks (checklist of made-up titles; the reader ticks chats they never had).
 * - Rejected: Flash (six-second memory test; tests short-term memory, not months-old memory).
 * - Rejected: Hunt (find one decision in forty titles; tallest, slowest, replays poorly).
 */

const TOTAL = 100;

const verdict = (value: number) => {
  if (value === 0) return "None. At least the filing system is consistent.";
  if (value <= 10) return "A handful. That matches what most people tell me.";
  if (value <= 35) return "Some. The rest are still in there, unlabelled.";
  if (value <= 70) return "Most of them is a confident answer. Try finding one from March.";
  return "Nearly all. Either your titles are better than mine, or you have not looked lately.";
};

export default function ChatRecallTest() {
  const [value, setValue] = useState(20);
  const [touched, setTouched] = useState(false);

  return (
    <section className="post-interaction my-10 text-foreground" aria-label="Recall estimate">
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-5 text-card-foreground shadow-xl shadow-black/5 sm:p-6">
        <label htmlFor="recall-estimate" className="block text-sm font-medium">
          Of your last 100 chats, how many could you find again right now?
        </label>

        <div className="mt-5 flex items-end justify-between gap-4">
          <p className="m-0 leading-none">
            <span className="text-5xl font-semibold tracking-tight tabular-nums">{value}</span>
            <span className="ml-2 text-sm text-muted-foreground">findable</span>
          </p>
          <p className="m-0 text-sm tabular-nums text-muted-foreground">{TOTAL - value} lost</p>
        </div>

        <div
          className="pointer-events-none mt-5 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5 select-none"
          aria-hidden="true"
        >
          {Array.from({ length: TOTAL }, (_, index) => (
            <span
              key={index}
              className={`aspect-square rounded-[3px] ${index < value ? "bg-foreground" : "bg-muted"}`}
            />
          ))}
        </div>

        <input
          id="recall-estimate"
          type="range"
          min={0}
          max={TOTAL}
          value={value}
          onChange={(event) => {
            setValue(Number(event.target.value));
            setTouched(true);
          }}
          className="mt-4 h-11 w-full cursor-pointer rounded-md touch-pan-y accent-foreground"
          aria-valuetext={`${value} of ${TOTAL} findable`}
        />

        <p className="m-0 min-h-12 text-sm leading-relaxed text-muted-foreground" role="status">
          {touched
            ? `${verdict(value)} Useful context can exist without being available when you need it.`
            : "Drag to your honest guess."}
        </p>
      </div>
    </section>
  );
}
