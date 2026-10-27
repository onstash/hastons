import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, "..");
const font = await readFile(
  join(
    projectRoot,
    "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  ),
);
const collections = ["notes", "posts", "bookshelf"];

async function contentFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await contentFiles(path)));
    else if (/\.(md|mdx)$/.test(entry.name)) files.push(path);
  }

  return files;
}

function escapeSlug(file, directory) {
  return relative(directory, file)
    .replace(/\.(md|mdx)$/, "")
    .replaceAll("\\", "/");
}

for (const collection of collections) {
  const directory = join(projectRoot, "src/content", collection);
  const files = await contentFiles(directory);

  for (const file of files) {
    const { data } = matter(await readFile(file, "utf8"));
    const slug = escapeSlug(file, directory);
    const output = join(
      projectRoot,
      "public/static/og",
      collection,
      `${slug}.png`,
    );

    const description = (data.description ?? "").replace(/\s+/g, " ");
    const shortDescription =
      description.length > 132
        ? `${description.slice(0, 129).trimEnd()}…`
        : description;

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            background: "#f5f5f7",
            color: "#1d1d1f",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px 58px",
            width: "1200px",
            height: "630px",
            fontFamily: "Inter",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#6e6e73",
                  fontSize: "22px",
                  letterSpacing: "0.08em",
                },
                children: [
                  { type: "div", props: { children: "HASTONS" } },
                  {
                    type: "div",
                    props: {
                      style: {
                        background: "#0071e3",
                        borderRadius: "999px",
                        width: "12px",
                        height: "12px",
                      },
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  left: "72px",
                  top: "176px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                  maxWidth: "1020px",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: data.title.length > 60 ? "52px" : "58px",
                        fontWeight: 600,
                        lineHeight: 1.04,
                        letterSpacing: "-0.035em",
                      },
                      children: data.title,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        color: "#6e6e73",
                        fontSize: "25px",
                        lineHeight: 1.25,
                        maxWidth: "850px",
                      },
                      children: shortDescription,
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  left: "72px",
                  right: "72px",
                  bottom: "58px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "2px solid #d2d2d7",
                  paddingTop: "20px",
                  color: "#6e6e73",
                  fontSize: "18px",
                  letterSpacing: "0.06em",
                },
                children: [
                  {
                    type: "div",
                    props: { children: collection.toUpperCase() },
                  },
                  { type: "div", props: { children: "HASTONS.VERCEL.APP" } },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [{ name: "Inter", data: font, weight: 400, style: "normal" }],
      },
    );

    await mkdir(dirname(output), { recursive: true });
    await writeFile(
      output,
      new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
        .render()
        .asPng(),
    );
    console.log(`${collection}/${slug}`);
  }
}
