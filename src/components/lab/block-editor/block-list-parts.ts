import { createParts } from "@ui-sdk/react/primitive";
import { blockList } from "./block-list";

const parts = createParts(blockList, {
  root: "div",
  item: "div",
  handle: "button",
});

const BlockList = parts.Root;
const BlockListItem = parts.Item;
const BlockListHandle = parts.Handle;

export { BlockList, BlockListHandle, BlockListItem };
