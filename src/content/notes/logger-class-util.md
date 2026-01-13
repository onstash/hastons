---
title: "Today I Learnt: A Minimal Logger Utility in TypeScript"
publishedAt: "2026-01-14"
description: "A small but powerful Logger utility for contextual, level-based logging in TypeScript applications."
slug: "today-i-learnt-logger-class-util"
category: "engineering"
---

# Why You Want a Logger Utility

In real projects, unstructured `console.log()` calls quickly become hard to manage:

- You can’t reliably filter output by severity (e.g., errors vs informational).
- Logs from different parts of the system all look the same.
- Timestamps are inconsistent or missing entirely.
- In production, logs are noisy and hard to scan.

This utility gives you:

1. **Consistent timestamps** in ISO format.
2. **Explicit log levels** that you can filter.
3. **Named contexts** (namespaces) so you can tell where logs come from.
4. Optionally toggle console output without changing call sites.

Those capabilities help you understand application behaviour faster during development and debugging.

## Before

```bash
# Without Logger
Loading...
Error found in user signup
ok
```

## After

```bash
# With Logger
[2026-01-14T18:42:31.102Z] [WARN] [AuthService] Token refresh failed
[2026-01-14T18:42:31.103Z] [INFO] [UserSignup] Completed signup step 2
```

## Logger Class

```ts
type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LoggerConfig {
  namespace: string;
  level: LogLevel;
  enableConsoleLog: boolean;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
};

export class Logger {
  private namespace: string;
  private level: LogLevel;
  private enableConsoleLog: boolean;

  private constructor(config: LoggerConfig) {
    this.namespace = config.namespace;
    this.level = config.level;
    this.enableConsoleLog = config.enableConsoleLog;
  }

  static createLogger(config: LoggerConfig): Logger {
    return new Logger(config);
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[messageLevel] >= LOG_LEVEL_PRIORITY[this.level];
  }

  private formatMessage(level: LogLevel, message: unknown): string {
    const timestamp = new Date().toISOString();
    const serialized =
      typeof message === "string" ? message : JSON.stringify(message, null, 2);

    return `[${timestamp}] [${level}] [${this.namespace}] ${serialized}`;
  }

  private log(level: LogLevel, message: unknown): void {
    if (!this.enableConsoleLog || !this.shouldLog(level)) return;

    const formatted = this.formatMessage(level, message);

    switch (level) {
      case "DEBUG":
      case "INFO":
        console.log(formatted);
        break;
      case "WARN":
        console.warn(formatted);
        break;
      case "ERROR":
        console.error(formatted);
        break;
    }
  }

  debug(message: unknown): void {
    this.log("DEBUG", message);
  }

  info(message: unknown): void {
    this.log("INFO", message);
  }

  warn(message: unknown): void {
    this.log("WARN", message);
  }

  error(message: unknown): void {
    this.log("ERROR", message);
  }
}
```

## Usage

```ts
const logger = Logger.createLogger({
  namespace: "PromptBuilder",
  level: "DEBUG",
  enableConsoleLog: true,
});

logger.debug("Debug message");
logger.info({ step: "init", status: "ok" });
logger.warn("Something looks off");
logger.error(new Error("Something failed"));
```
