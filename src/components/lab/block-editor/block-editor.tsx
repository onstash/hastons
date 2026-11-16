import * as React from "react";
import { Button } from "@ui-sdk/react/button";
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { toast } from "@ui-sdk/react/toast";
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu";
import { BlockList, BlockListHandle, BlockListItem } from "./block-list-parts";
import {
  blockTypes,
  createBlock,
  shortcutType,
  starterBlocks,
  toMarkdown,
  typeLabel,
} from "./model";
import type { Block, BlockType } from "./model";

interface FocusRequest {
  id: string;
  caret: number;
}

function BlockEditor() {
  const [blocks, setBlocks] = React.useState(starterBlocks);
  const root = React.useRef<HTMLDivElement>(null);
  const focusRequest = React.useRef<FocusRequest | null>(null);

  React.useEffect(() => {
    const request = focusRequest.current;
    if (!request) {
      return;
    }
    focusRequest.current = null;
    const target = root.current?.querySelector<HTMLElement>(
      `[data-block-id="${request.id}"] [data-block-focus]`,
    );
    target?.focus();
    if (target instanceof HTMLTextAreaElement) {
      const caret = Math.min(request.caret, target.value.length);
      target.setSelectionRange(caret, caret);
    }
  }, [blocks]);

  function focusBlock(id: string, caret = 0) {
    focusRequest.current = { id, caret };
  }

  function update(id: string, patch: Partial<Block>) {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    );
  }

  function setType(id: string, type: BlockType) {
    if (type !== "divider") {
      update(id, { type });
      focusBlock(id, Number.MAX_SAFE_INTEGER);
      return;
    }
    const next = createBlock();
    setBlocks((current) =>
      current.flatMap((block) =>
        block.id === id ? [{ ...block, type, text: "" }, next] : [block],
      ),
    );
    focusBlock(next.id);
  }

  function insertAfter(id: string, block: Block) {
    setBlocks((current) =>
      current.flatMap((entry) => (entry.id === id ? [entry, block] : [entry])),
    );
    focusBlock(block.id);
  }

  function remove(id: string) {
    const index = blocks.findIndex((block) => block.id === id);
    const neighbor = blocks[index - 1] ?? blocks[index + 1];
    if (!neighbor) {
      update(id, { type: "text", text: "", checked: false });
      focusBlock(id);
      return;
    }
    setBlocks((current) => current.filter((block) => block.id !== id));
    focusBlock(neighbor.id, neighbor.text.length);
  }

  function mergeIntoPrevious(id: string) {
    const index = blocks.findIndex((block) => block.id === id);
    const previous = blocks[index - 1];
    const block = blocks[index];
    if (!previous || !block) {
      return;
    }
    if (previous.type === "divider") {
      remove(previous.id);
      focusBlock(id);
      return;
    }
    setBlocks((current) =>
      current
        .filter((entry) => entry.id !== id)
        .map((entry) =>
          entry.id === previous.id ? { ...entry, text: previous.text + block.text } : entry,
        ),
    );
    focusBlock(previous.id, previous.text.length);
  }

  function focusNeighbor(id: string, step: -1 | 1) {
    const index = blocks.findIndex((block) => block.id === id);
    const neighbor = blocks[index + step];
    if (!neighbor) {
      return false;
    }
    focusBlock(neighbor.id, step === -1 ? neighbor.text.length : 0);
    setBlocks((current) => [...current]);
    return true;
  }

  function reorder(order: string[]) {
    setBlocks((current) => order.flatMap((id) => current.find((block) => block.id === id) ?? []));
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(toMarkdown(blocks));
      toast("Copied the page as Markdown");
    } catch {
      toast("The browser blocked the clipboard");
    }
  }

  const words = blocks.flatMap((block) => block.text.split(/\s+/)).filter(Boolean).length;
  const done = blocks.filter((block) => block.type === "todo" && block.checked);
  const todos = blocks.filter((block) => block.type === "todo");

  return (
    <div className="editor" ref={root}>
      <div className="toolbar-row">
        <p className="hint" role="status" aria-label="Page stats">
          {blocks.length} blocks · {words} words · {done.length}/{todos.length} to-dos done
        </p>
        <Button onClick={copyMarkdown}>Copy as Markdown</Button>
      </div>
      <BlockList
        aria-label="Page blocks"
        value={blocks.map((block) => block.id)}
        onValueChange={reorder}
      >
        {({ order }) =>
          order.map((id) => {
            const block = blocks.find((entry) => entry.id === id);
            if (!block) {
              return null;
            }
            const position = blocks.indexOf(block) + 1;
            return (
              <BlockListItem
                key={block.id}
                value={block.id}
                className="block"
                data-block-id={block.id}
                data-type={block.type}
              >
                <BlockListHandle className="block-handle" aria-label={`Move block ${position}`}>
                  <svg viewBox="0 0 10 16" aria-hidden="true">
                    <circle cx="2" cy="3" r="1.4" />
                    <circle cx="8" cy="3" r="1.4" />
                    <circle cx="2" cy="8" r="1.4" />
                    <circle cx="8" cy="8" r="1.4" />
                    <circle cx="2" cy="13" r="1.4" />
                    <circle cx="8" cy="13" r="1.4" />
                  </svg>
                </BlockListHandle>
                <BlockRow
                  block={block}
                  position={position}
                  onChange={(patch) => update(block.id, patch)}
                  onType={(type) => setType(block.id, type)}
                  onSplit={(before, after) => {
                    update(block.id, { text: before });
                    insertAfter(
                      block.id,
                      createBlock(block.type === "todo" ? "todo" : "text", after),
                    );
                  }}
                  onMerge={() => mergeIntoPrevious(block.id)}
                  onRemove={() => remove(block.id)}
                  onMove={(step) => focusNeighbor(block.id, step)}
                />
              </BlockListItem>
            );
          })
        }
      </BlockList>
    </div>
  );
}

interface BlockRowProps {
  block: Block;
  position: number;
  onChange: (patch: Partial<Block>) => void;
  onType: (type: BlockType) => void;
  onSplit: (before: string, after: string) => void;
  onMerge: () => void;
  onRemove: () => void;
  onMove: (step: -1 | 1) => boolean;
}

function BlockRow({
  block,
  position,
  onChange,
  onType,
  onSplit,
  onMerge,
  onRemove,
  onMove,
}: BlockRowProps) {
  const menuOpen = React.useRef(false);
  const field = React.useRef<HTMLTextAreaElement>(null);

  // The field is uncontrolled so the slash menu can edit its text. Push state changes into it.
  React.useEffect(() => {
    if (field.current && field.current.value !== block.text) {
      field.current.value = block.text;
    }
  }, [block.text]);

  if (block.type === "divider") {
    return (
      <div className="block-divider">
        <hr />
        <Button
          data-block-focus
          aria-label={`Delete divider, block ${position}`}
          onClick={onRemove}
          onKeyDown={(event) => {
            if (event.key === "Backspace" || event.key === "Delete") {
              onRemove();
            }
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Button>
      </div>
    );
  }

  function onInput(event: React.FormEvent<HTMLTextAreaElement>) {
    const element = event.currentTarget;
    const type = block.type === "text" ? shortcutType(element.value) : undefined;
    if (type) {
      element.value = "";
      onChange({ text: "" });
      onType(type);
      return;
    }
    onChange({ text: element.value });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (menuOpen.current || event.nativeEvent.isComposing) {
      return;
    }
    const element = event.currentTarget;
    const { selectionStart, selectionEnd, value } = element;
    const collapsed = selectionStart === selectionEnd;

    if (event.key === "Enter" && !event.shiftKey) {
      if (block.type === "code" && !(event.metaKey || event.ctrlKey)) {
        return;
      }
      event.preventDefault();
      if (value === "" && block.type !== "text") {
        onType("text");
        return;
      }
      onSplit(value.slice(0, selectionStart), value.slice(selectionEnd));
      return;
    }
    if (event.key === "Backspace" && collapsed && selectionStart === 0) {
      event.preventDefault();
      if (block.type !== "text") {
        onType("text");
      } else {
        onMerge();
      }
      return;
    }
    if (event.key === "ArrowUp" && collapsed && selectionStart === 0) {
      if (onMove(-1)) {
        event.preventDefault();
      }
      return;
    }
    if (event.key === "ArrowDown" && collapsed && selectionStart === value.length) {
      if (onMove(1)) {
        event.preventDefault();
      }
    }
  }

  return (
    <div className="block-body">
      {block.type === "todo" && (
        <Checkbox
          aria-label={`Done, block ${position}`}
          checked={block.checked}
          onCheckedChange={(checked) => onChange({ checked: checked === true })}
        >
          <CheckboxIndicator />
        </Checkbox>
      )}
      <TriggerMenu
        triggers={[{ char: "/" }]}
        onOpenChange={(open) => {
          menuOpen.current = open;
        }}
      >
        <TriggerMenuInput
          ref={field}
          data-block-focus
          className="block-text"
          data-checked={block.checked ? "" : undefined}
          aria-label={`Block ${position}, ${typeLabel(block.type)}`}
          placeholder={block.type === "text" ? "Type / for blocks" : typeLabel(block.type)}
          rows={1}
          spellCheck={block.type !== "code"}
          defaultValue={block.text}
          onInput={onInput}
          onKeyDown={onKeyDown}
        />
        <TriggerMenuContent className="slash-menu">
          <TriggerMenuEmpty>No block matches</TriggerMenuEmpty>
          <TriggerMenuList>
            {blockTypes.map((entry) => (
              <TriggerMenuItem
                key={entry.value}
                value={entry.value}
                label={entry.label}
                onSelect={(value, details) => {
                  details.insert("");
                  onChange({ text: field.current?.value ?? "" });
                  onType(value as BlockType);
                }}
              >
                <span>{entry.label}</span>
                <span className="hint">{entry.hint}</span>
              </TriggerMenuItem>
            ))}
          </TriggerMenuList>
        </TriggerMenuContent>
      </TriggerMenu>
    </div>
  );
}

export { BlockEditor };
