import { defineCollection, z } from "astro:content";

// const posts = defineCollection({
//   type: "content",
//   schema: z.object({
//     title: z.string(),
//     description: z.string(),
//     publishedAt: z.coerce.date(),
//     image: z.string().default("/static/blog-placeholder.png"),
//   }),
// });

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

const bookshelf = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().default("/static/blog-placeholder.png"),
  }),
});

export const collections = {
  // posts,
  notes,
  bookshelf,
};
