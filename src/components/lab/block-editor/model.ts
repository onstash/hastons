type BlockType = "text" | "h1" | "h2" | "todo" | "quote" | "code" | "divider";

interface Block {
  id: string;
  type: BlockType;
  text: string;
  checked: boolean;
}

const blockTypes: { value: BlockType; label: string; hint: string }[] = [
  { value: "text", label: "Text", hint: "Plain paragraph" },
  { value: "h1", label: "Heading 1", hint: "# then space" },
  { value: "h2", label: "Heading 2", hint: "## then space" },
  { value: "todo", label: "To-do", hint: "[] then space" },
  { value: "quote", label: "Quote", hint: "> then space" },
  { value: "code", label: "Code", hint: "``` then space" },
  { value: "divider", label: "Divider", hint: "--- then space" },
];

const shortcuts = {
  "# ": "h1",
  "## ": "h2",
  "[] ": "todo",
  "> ": "quote",
  "``` ": "code",
  "--- ": "divider",
} satisfies Record<ShortcutText, BlockType>;

type ShortcutText = "# " | "## " | "[] " | "> " | "``` " | "--- ";

// Looks up a shortcut by its exact text. Unknown text has no block type.
function shortcutType(text: string): BlockType | undefined {
  return Object.hasOwn(shortcuts, text) ? shortcuts[text as ShortcutText] : undefined;
}

let count = 0;

function createBlock(type: BlockType = "text", text = ""): Block {
  count += 1;
  return { id: `block-${count}`, type, text, checked: false };
}

function typeLabel(type: BlockType) {
  return blockTypes.find((entry) => entry.value === type)?.label ?? "Text";
}

function toMarkdown(blocks: Block[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h1":
          return `# ${block.text}`;
        case "h2":
          return `## ${block.text}`;
        case "todo":
          return `- [${block.checked ? "x" : " "}] ${block.text}`;
        case "quote":
          return `> ${block.text}`;
        case "code":
          return `\`\`\`\n${block.text}\n\`\`\``;
        case "divider":
          return "---";
        default:
          return block.text;
      }
    })
    .join("\n\n");
}

function starterBlocks(): Block[] {
  return [
    createBlock("h1", "Untitled page"),
    createBlock("text", "Type / for a block menu. Press Enter for a new block."),
    createBlock("todo", "Drag the handle, or focus it and press Space"),
    createBlock("quote", "Markdown shortcuts work at the start of a block."),
    createBlock("text", ""),
  ];
}

export { blockTypes, createBlock, shortcutType, starterBlocks, toMarkdown, typeLabel };
export type { Block, BlockType };
