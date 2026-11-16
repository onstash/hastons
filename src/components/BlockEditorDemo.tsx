import { BlockEditor } from "./lab/block-editor/block-editor";
import "./lab/block-editor/block-editor.css";

export default function BlockEditorDemo() {
  return (
    <div className="block-lab not-prose my-8 rounded-xl border border-black/10 p-6">
      <BlockEditor />
    </div>
  );
}
