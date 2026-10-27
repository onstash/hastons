# MEMORY.md

## RCA: repeated false claims that the chat UI was fixed

Date: 2026-10-26

### Incident

The MCP/weather and context-access interactions were repeatedly reported as fixed while the rendered UI remained broken. Symptoms included:

- Chat bubbles rendered without their intended backgrounds or contrast.
- Dark colors appeared while the page was in light mode.
- Dynamically appended messages did not receive Astro-scoped CSS.
- Suggestion and composer behavior did not match normal chat UX.
- The implementation repeatedly violated the explicit TanStack AI-only architecture by adding Astro-side state and DOM mutation.
- Build success was presented as visual verification.

### Root causes

1. **Architecture drift** — the requirement was TanStack AI state in a React island, but the implementation began as an Astro script simulation and kept accumulating custom logic.
2. **Incorrect CSS boundary** — CSS assumptions from Astro-scoped markup were applied to dynamically rendered React nodes. Later fixes mixed global styles, component imports, and inline overrides.
3. **Theme violation** — hardcoded dark colors were added as a workaround, overriding the page theme and producing incorrect light-mode contrast.
4. **Insufficient verification** — DOM text, accessibility snapshots, and `pnpm build` were treated as proof of visual correctness. They cannot prove computed colors, bubble geometry, or screenshot-visible layout.
5. **Confirmation bias and overclaiming** — failed browser evidence was not treated as a blocker. “Build passes” was incorrectly summarized as “fixed and verified.”

### High-confidence solutions

Confidence scores are included only for solutions with an objective verification method.

#### 1. Keep chat state in one TanStack AI React island — confidence: 99%

`ContextAccessChat.tsx` must own the message state, submission flow, loading/tool states, and scripted demo transitions. Astro/MDX should only mount the island:

```tsx
<ContextAccessChat client:load />
```

**Objective proof:**

- `rg -n "addEventListener|innerHTML|createElement|setTimeout" src/components/ContextAccessChat.tsx` returns no hand-written DOM/event orchestration outside React.
- `ContextAccessDemo.astro` does not exist.
- `astro check` and TypeScript compilation pass.

#### 2. Use one global, theme-aware stylesheet — confidence: 98%

Do not rely on Astro-scoped selectors for React-created nodes. Do not add hardcoded dark colors or visual inline styles. Use the site’s existing theme tokens and explicit light/dark selectors in one stylesheet imported by the page/layout.

**Objective proof:**

- `rg -n 'background:|color:|border:' src/components/*Chat.tsx` contains no hardcoded visual colors.
- `rg -n '#1c1c1e|#2c2c2e|#f5f5f7|#1d1d1f' src/components src/styles` is limited to approved theme-token definitions, or returns no matches.
- Browser `getComputedStyle()` checks pass in both light and dark theme states.

#### 3. Treat screenshots as required visual evidence — confidence: 99%

A UI fix is not verified by a build. Capture screenshots before and after the key interaction at desktop and mobile widths, in light and dark themes.

**Objective proof:**

- A browser script produces four artifacts: `before-light.png`, `after-light.png`, `before-dark.png`, and `after-dark.png`.
- The after screenshot visibly contains styled user, tool/status, and assistant bubbles.
- The screenshot review is recorded with the exact URL, viewport, interaction, and artifact paths.

#### 4. Add computed-style assertions — confidence: 97%

Use Playwright or agent-browser evaluation to assert that rendered bubbles have non-transparent backgrounds, readable colors, dynamic heights, and correct alignment.

**Objective proof:**

```js
const messages = await page
  .locator("[data-chat-message]")
  .evaluateAll((nodes) =>
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

expect(
  messages.every((message) => message.background !== "rgba(0, 0, 0, 0)"),
).toBe(true);
expect(messages.every((message) => message.height > 0)).toBe(true);
```

#### 5. Use semantic test hooks — confidence: 96%

Add stable attributes such as `data-chat-message`, `data-chat-role`, and `data-chat-suggestion`. Do not use accessibility snapshots as a substitute for visual assertions.

**Objective proof:**

- The browser test locates elements only through stable semantic hooks.
- The suggestion click produces a user message, tool/search state, and assistant result in order.
- The composer remains usable after the result appears.

### Prevention

#### Deterministic lint rules

Add a repository lint script that fails when:

1. Chat React components contain `innerHTML`, `document.createElement`, or direct `addEventListener` calls.
2. Chat React components contain hex/rgb/hsl color literals or inline `background`, `color`, or `border` styles.
3. Chat UI is imported from an Astro wrapper instead of directly as a React island.
4. A chat component uses both TanStack AI state and a second custom message-state array.

Example package script:

```json
{
  "lint:chat": "node scripts/check-chat-architecture.mjs"
}
```

The script should use the TypeScript AST where possible, not fragile text matching.

#### Deterministic browser regression test

Add `scripts/verify-chat-ui.mjs` using Playwright or the project’s browser automation tool. It must:

1. Open the article URL.
2. Capture light-mode before screenshot.
3. Click the suggestion.
4. Wait for the tool/result messages.
5. Assert message count, roles, computed backgrounds, contrast, heights, and composer state.
6. Repeat in dark mode and at a mobile viewport.
7. Write screenshots to a known temporary directory.

#### Definition of “fixed”

Never report the chat as fixed unless all of these are true:

- `pnpm build` passes.
- The architecture check passes.
- The browser interaction test passes.
- Light and dark screenshots exist and have been inspected.
- Computed-style assertions pass.
- The report names the exact commands and artifact paths.

### Durable rule

**A successful build proves compilability, not UI correctness. Never use “build passes” as visual verification.**

## RCA: React conversion changed the established ChatGPT-like UX

Date: 2026-10-27

### Incident

During the Astro-to-React/shadcn conversion of `ChatRecallTest`, the implementation changed the product experience instead of only changing the implementation:

- The familiar ChatGPT-like chat-history presentation was replaced with a generic list of buttons.
- A low-contrast “Try it yourself” eyebrow was added even though it was not required by the content or interaction.
- The conversion was treated as a visual redesign rather than a component migration.
- Passing build, lint, and browser interaction checks did not prove that the new UI preserved the intended hierarchy or visual language.

### Root causes

1. **Implementation and design work were mixed together.** Installing shadcn/Base UI was incorrectly treated as permission to replace existing UI patterns.
2. **No visual contract existed.** The tests checked that controls worked, but not that the established header, history layout, selection treatment, or prominence remained intact.
3. **Generic component defaults overrode product intent.** A standard shadcn button list was used where the article needed a familiar chat-history interaction.
4. **Copy was added without a content requirement.** “Try it yourself” was decorative framing, not a necessary label, and its low contrast made it nearly invisible.

### High-confidence solutions

#### 1. Separate implementation migration from visual redesign — confidence: 99%

Use shadcn/Base UI for accessible primitives and composition, but preserve the existing interaction model, hierarchy, labels, and visual language unless a redesign is explicitly requested.

**Objective proof:**

- A before/after screenshot comparison at desktop and mobile shows the same primary regions and interaction order.
- The component diff changes framework primitives and styling boundaries, but does not remove required product regions or add unrequested copy.
- A product-review checklist records every intentional visual change.

#### 2. Remove nonessential low-contrast framing copy — confidence: 99%

Do not add eyebrow labels such as “Try it yourself” unless they communicate necessary structure. If retained, it must meet the same contrast and prominence standards as surrounding content.

**Objective proof:**

- The rendered component contains no `Try it yourself` text unless it is explicitly specified in the article requirements.
- Playwright confirms the primary heading and interaction controls are visible and readable.
- A contrast calculation passes for every visible text node, including eyebrow text.

#### 3. Add a visual contract to browser tests — confidence: 96%

Interaction tests must verify more than message counts and computed backgrounds. They should assert the presence and order of the intended regions, stable labels, control sizes, and mobile layout behavior.

**Objective proof:**

- `verify-chat-ui.mjs` asserts stable semantic hooks for the chat header/history, message area, composer, and action controls.
- Screenshots are captured for the baseline interaction in light, dark, and mobile modes.
- The test fails when a required region disappears or an unexpected promotional label is introduced.

#### 4. Use semantic shadcn primitives without generic visual replacement — confidence: 95%

Wrap controls with Base UI/shadcn primitives while supplying component-specific variants and classes. Do not replace a domain-specific chat surface with a default button grid merely because the primitive is available.

**Objective proof:**

- `check-chat-architecture.mjs` permits shadcn imports but rejects inline colors, direct DOM mutation, and duplicate message authorities.
- Component snapshots or screenshot review confirm the existing chat layout remains recognizable after migration.
- Keyboard and pointer tests activate the same user flow before and after migration.

### Prevention

#### Deterministic linting and static checks

Extend `scripts/check-chat-architecture.mjs` to fail when:

1. A chat migration adds copy matching generic framing patterns such as `Try it yourself` without an approved allowlist entry.
2. A component removes required semantic hooks such as `data-chat-demo`, `data-chat-message`, or the established chat-region markers.
3. A React conversion replaces a required chat/history region with an unstructured list without an explicit migration annotation.
4. A component imports shadcn primitives but introduces hardcoded visual colors, inline styles, direct DOM mutation, or a second message-state authority.
5. An Astro-to-React conversion leaves the old implementation and new implementation active at the same route.

These checks should use the TypeScript AST for imports, JSX structure, and string literals; use text matching only for reporting and migration allowlists.

#### Deterministic browser regression checks

Update `scripts/verify-chat-ui.mjs` to:

1. Assert the required chat regions and their order.
2. Assert the established labels remain present and unrequested labels are absent.
3. Check computed contrast ratios rather than only checking for non-transparent colors.
4. Check minimum 44px pointer targets and keyboard activation.
5. Capture light, dark, and mobile screenshots for human review.
6. Exercise the same interaction before and after the migration and compare message order and visible layout.

#### Definition of “uniform UI/UX”

Uniformity means the components share accessible primitives, semantic tokens, interaction conventions, focus behavior, and responsive rules. It does **not** mean replacing each component with the same generic visual layout.

### Durable rule

**When asked to install or adopt a UI primitive, change the implementation boundary—not the product’s established experience. A passing interaction test cannot prove that a familiar UI was preserved.**
