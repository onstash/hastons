import {
  createChange,
  createReorder,
  css,
  definePrimitive,
  type ChangeDetails,
  type ReorderDraft,
  type ReorderReason,
} from "@ui-sdk/core";

interface BlockListOptions {
  value: string[];
  onValueChange?: (value: string[], details: ChangeDetails<ReorderReason>) => void;
}

interface BlockListState {
  value: string[];
  moving: ReorderDraft | null;
}

const blockList = definePrimitive({
  name: "block-list",
  options: { value: "list", onValueChange: "callback" },
  state: (options: BlockListOptions): BlockListState => ({
    value: options.value,
    moving: null,
  }),
  sync: (options) => ({ value: options.value }),
  controlled: ["value"],
  api: (context) => {
    const change = createChange(context);
    const reorder = createReorder<BlockListState>(context, {
      slot: "item",
      key: "value",
      draft: "moving",
      set: (value, details) => change("value", value, details),
    });
    return {
      reorder,
      move: (key: string, index: number) => reorder.move(key, index),
    };
  },
  slots: (slot) => ({
    root: slot<{}, { order: string[] }>({
      state: (state, { api }) => ({ order: api.reorder.order(state) }),
      attrs: (state) => ({
        role: "list",
        "data-moving": state.moving ? "" : undefined,
      }),
    }),
    item: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        role: "listitem",
        "data-moving": part.api.reorder.moving(state, part.key) ? "" : undefined,
        "data-dragging": part.api.reorder.dragging(state, part.key) ? "" : undefined,
      }),
      bind: (el, part) => part.api.reorder.bind(el, part),
    }),
    handle: slot<{ value?: string }>({
      props: { value: { kind: "string", from: "item" } },
      attrs: (state, part) => ({
        type: "button",
        "aria-roledescription": "drag handle",
        "aria-pressed": String(state.moving?.key === part.key),
        style: css({ "touch-action": "none" }),
      }),
      on: {
        keydown: (event, { api, key }) => api.reorder.keydown(event, key),
        pointerdown: (event, { api, key }) => api.reorder.pointerdown(event, key),
      },
    }),
  }),
  agent: { actions: ["move"] },
});

export { blockList };
