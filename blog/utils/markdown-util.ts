import fs from "fs";
import path from "path";

import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import { BlogPostLinkWithTitleAndSlug } from "../components/FooterNavigation";

export type BlogPostSlug = string|null;

const markdownDirectory = path.join(process.cwd(), "blog/markdown");

// Recursively fetch all .mdx files from the directory
function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (filePath.endsWith('.mdx')) {
      results.push(filePath);
    }
  });

  return results;
}
const allMarkdownFiles = getFilesRecursively(markdownDirectory).map(filePath => ({
  filePath,
  slug: filePath.replace(markdownDirectory, "").replace(/\.mdx$/, "")
}));
const allMarkdownFilesCount = allMarkdownFiles.length;

export function getAllMDXFilePaths(dir?: string) {
  console.log("@@ getAllMDXFilePaths");
  const fileNames = fs.readdirSync(
    dir?.length ? path.join(markdownDirectory, dir) : markdownDirectory
  );
  console.log("@@ getAllMDXFilePaths", { fileNames });
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith(".mdx"));
  console.log("@@ getAllMDXFilePaths", { mdxFiles });

  return {
    paths: mdxFiles.map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      console.log("@@ getAllMDXFilePaths", { slug });
      return {
        params: { slug },
      };
    }),
    fallback: false,
    mdxFiles: dir
      ? mdxFiles.map((mdxFile) => path.join(dir, mdxFile).replace(/\.mdx$/, ""))
      : mdxFiles,
  };
}

export async function getMDXFileContent(slug: BlogPostSlug) {
  console.log("@@ getMDXFileContent", { slug });
  const fullPath = path.join(markdownDirectory, `${slug}.mdx`);
  console.log("@@ getMDXFileContent", { fullPath });
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { content, data } = matter(fileContents);
  const mdxSource = await serialize(content, { scope: data });
  console.log("@@ getMDXFileContent", { mdxSource, content, data });

  return {
    source: mdxSource,
    frontmatter: data,
  };
}


export async function getPreviousAndNextBlogPosts(currentPageSlug: BlogPostSlug): Promise<{
  previousBlogPost: BlogPostLinkWithTitleAndSlug | null,
  nextBlogPost: BlogPostLinkWithTitleAndSlug | null,
}> {
  console.log('@@ getPreviousAndNextBlogPosts()', {currentPageSlug});
  const currentPageSlugWithSlashPrefix = `/${currentPageSlug}`;
  let allMarkdownFilesWithContent: Array<{slug: string; shortTitle: string; publishedAt: Date}> = [];
  for (let _node of allMarkdownFiles) {
    const { slug } = _node;
    const _content = await getMDXFileContent(slug);
    allMarkdownFilesWithContent.push({ slug, shortTitle: _content.frontmatter.shortTitle, publishedAt: new Date(_content.frontmatter.publishedAt) })
  }
  console.log('@@ allMarkdownFilesWithContent (before)', allMarkdownFilesWithContent);
  allMarkdownFilesWithContent.sort((a, b) => a.publishedAt > b.publishedAt ? -1 : 1);
  console.log('@@ allMarkdownFilesWithContent (after)', allMarkdownFilesWithContent);

  let previousBlogPostSlug: BlogPostLinkWithTitleAndSlug["slug"] | null = null;
  let previousBlogPostTitle: BlogPostLinkWithTitleAndSlug["title"] | null = null;

  let nextBlogPostSlug: BlogPostLinkWithTitleAndSlug["slug"] | null = null;
  let nextBlogPostTitle: BlogPostLinkWithTitleAndSlug["title"] | null = null;

  allMarkdownFilesWithContent.forEach(({ slug }, index) => {
    console.log('@@ getPreviousAndNextBlogPosts() allMarkdownFilesWithContent loop', index, {slug, currentPageSlug});
    if (slug === currentPageSlugWithSlashPrefix) {
      if (index - 1 >= 0) {
        previousBlogPostSlug = allMarkdownFilesWithContent[index - 1].slug;
        previousBlogPostTitle = allMarkdownFilesWithContent[index - 1].shortTitle;
      }
      if (index + 1 < allMarkdownFilesCount) {
        nextBlogPostSlug = allMarkdownFilesWithContent[index + 1].slug;
        nextBlogPostTitle = allMarkdownFilesWithContent[index + 1].shortTitle;
      }
    }
  });


  return {
    nextBlogPost: previousBlogPostSlug !== null && previousBlogPostTitle !== null ? { title: previousBlogPostTitle, slug: previousBlogPostSlug } : null,
    previousBlogPost: nextBlogPostSlug !== null && nextBlogPostTitle !== null ? { title: nextBlogPostTitle, slug: nextBlogPostSlug } : null,
  }
}
