import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const chatFiles = fs
  .readdirSync(path.join(root, "src/components"), { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".tsx") &&
      /chat|mcp/i.test(entry.name) &&
      !entry.name.includes("ConnectionExplainer"),
  )
  .map((entry) => path.join(root, "src/components", entry.name));
const failures = [];

function report(file, node, message) {
  const { line } = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart());
  failures.push(`${path.relative(root, file)}:${line + 1}: ${message}`);
}

for (const file of chatFiles) {
  const source = fs.readFileSync(file, "utf8");
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let usesTanStack = false;
  let customMessageState = false;

  function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@tanstack/ai-react")
      usesTanStack = true;
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "useState"
    ) {
      const text = node.getText(tree);
      if (/message|conversation|chat/i.test(text)) customMessageState = true;
    }
    if (ts.isPropertyAccessExpression(node) && node.name.text === "innerHTML")
      report(file, node, "chat components must not use innerHTML");
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "createElement"
    )
      report(file, node, "chat components must not use document.createElement");
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "addEventListener"
    )
      report(file, node, "chat components must not use direct addEventListener");
    if (ts.isStringLiteral(node) && /#(?:[\da-f]{3,8})\b|\b(?:rgb|hsl)a?\(/i.test(node.text))
      report(file, node, "chat components must use theme tokens, not literal colors");
    if (ts.isJsxAttribute(node) && node.name.text === "style")
      report(file, node, "chat components must not use inline style attributes");
    ts.forEachChild(node, visit);
  }

  visit(tree);
  if (!usesTanStack && !file.endsWith("ChatRecallTest.tsx"))
    failures.push(`${path.relative(root, file)}: AI chat UI must use @tanstack/ai-react`);
  if (customMessageState)
    failures.push(
      `${path.relative(root, file)}: do not combine TanStack AI state with custom message state`,
    );
}

const mdxRoot = path.join(root, "src/content");
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith(".mdx")) {
      const source = fs.readFileSync(target, "utf8");
      if (/ContextAccessDemo\.astro|McpWeatherPuzzle\.astro/.test(source))
        failures.push(
          `${path.relative(root, target)}: chat UI must be imported directly as a React island, not through an Astro wrapper`,
        );
    }
  }
}
walk(mdxRoot);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Chat architecture check passed (${chatFiles.length} React chat files).`);
