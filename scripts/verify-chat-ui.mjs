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
  const lightBefore = await assertMessages("light before", 1);

  // Access off: the request is stopped at the connection.
  const toggle = chat.getByRole("switch", { name: "Allow access to my notes" });
  await chat.getByRole("button", { name: "Ask the question" }).click();
  await chat.getByText("I can’t see your notes", { exact: false }).waitFor({ timeout: 10000 });
  await assertMessages("light blocked", 2);

  // Access on: the note comes back.
  await toggle.click();
  if ((await toggle.getAttribute("aria-checked")) !== "true")
    throw new Error("Access switch did not turn on");
  await assertMessages("after switching on", 1);
  await chat.getByRole("button", { name: "Ask the question" }).click();
  await chat.getByText("food and hiking", { exact: false }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);
  const lightAfter = await assertMessages("light after", 2);
  await page.screenshot({ path: path.join(outputDir, "light-after.png"), fullPage: true });

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.screenshot({ path: path.join(outputDir, "dark-after.png"), fullPage: true });
  const darkAfter = await assertMessages("dark after", 2);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(outputDir, "mobile-after.png"), fullPage: true });
  const mobileAfter = await assertMessages("mobile after", 2);

  // Turning access back off clears the answer.
  await toggle.click();
  await assertMessages("after switching off", 1);

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
