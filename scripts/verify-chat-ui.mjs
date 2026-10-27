import { chromium } from "playwright";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const url =
  process.env.CHAT_UI_URL ?? "http://localhost:4321/notes/how-many-chatgpt-chats-do-you-remember/";
const outputDir = path.join(os.tmpdir(), "hastons-chat-ui");
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const chat = page.locator('[data-chat-demo="context-access"]');
const messages = chat.locator("[data-chat-message]");

async function assertMessages(label, minimum) {
  if ((await messages.count()) !== minimum)
    throw new Error(`${label}: expected ${minimum} messages, got ${await messages.count()}`);
  const styles = await messages.evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        background: style.backgroundColor,
        color: style.color,
        height: rect.height,
        width: rect.width,
      };
    }),
  );
  if (
    !styles.every(
      (item) =>
        item.height > 0 &&
        item.width > 0 &&
        item.background !== "rgba(0, 0, 0, 0)" &&
        item.color !== "rgba(0, 0, 0, 0)",
    )
  ) {
    throw new Error(`${label}: messages have invalid computed styles: ${JSON.stringify(styles)}`);
  }
  return styles;
}

try {
  await page.goto(url, { waitUntil: "networkidle" });
  if (!(await chat.isVisible())) throw new Error("Chat demo is not visible");
  await page.screenshot({ path: path.join(outputDir, "light-before.png"), fullPage: true });
  const lightBefore = await assertMessages("light before", 2);

  await chat.getByRole("button", { name: "Then look through my notes" }).click();
  await page.waitForTimeout(1200);
  if (!(await chat.getByText("I found a note from last week", { exact: false }).isVisible()))
    throw new Error("Note result is not visible");
  if ((await messages.count()) !== 5)
    throw new Error(`light after: expected 5 messages, got ${await messages.count()}`);
  if ((await chat.getByRole("button", { name: "Then look through my notes" }).count()) !== 0)
    throw new Error("Suggestion remained after activation");
  if (!(await chat.locator("#context-demo-input").isEnabled()))
    throw new Error("Composer is not enabled");
  const lightAfter = await assertMessages("light after", 5);
  await page.screenshot({ path: path.join(outputDir, "light-after.png"), fullPage: true });

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.screenshot({ path: path.join(outputDir, "dark-after.png"), fullPage: true });
  const darkAfter = await assertMessages("dark after", 5);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(outputDir, "mobile-after.png"), fullPage: true });
  const mobileAfter = await assertMessages("mobile after", 5);

  console.log(
    JSON.stringify(
      { ok: true, url, outputDir, lightBefore, lightAfter, darkAfter, mobileAfter },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
