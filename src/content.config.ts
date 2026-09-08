import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

const notes = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

const bookshelf = defineCollection({
  loader: glob({ base: "./src/content/bookshelf", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

export const collections = {
  posts,
  notes,
  bookshelf,
};
