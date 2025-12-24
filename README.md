# Hastons

**Hastons** is a personal blog built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/).

## Features

- Blog post authoring using [Markdown](https://www.markdownguide.org/) and [MDX](https://mdxjs.com/) for component-style content
- Bookshelf collection for tracking reading lists
- Code block syntax highlighting with [Shiki](https://github.com/shikijs/shiki)
- [RSS](https://en.wikipedia.org/wiki/RSS) feed and sitemap generation
- SEO optimization with customizable OpenGraph image support
- Code formatting with [Prettier](https://prettier.io/)
- Accessible view transitions
- Dark mode

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hastons.git
cd hastons
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

5. Preview the production build:

```bash
pnpm preview
```

## Development Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start the development server         |
| `pnpm build`        | Build the site for production        |
| `pnpm preview`      | Preview the production build locally |
| `pnpm format`       | Format code with Prettier            |
| `pnpm format:check` | Check code formatting                |

## Project Structure

```
src/
├── components/     # Reusable Astro components
├── content/
│   ├── posts/      # Blog posts (Markdown/MDX)
│   ├── bookshelf/  # Bookshelf entries
│   └── drafts/     # Draft posts
├── layouts/        # Page layouts
├── pages/          # Route pages
└── styles/         # Global styles
```

## Site Configuration

Edit `src/consts.ts` to update site metadata:

```ts
export const SITE_URL = "https://hastons.vercel.app";
export const SITE_TITLE = "Hastons";
export const SITE_DESCRIPTION =
  "Hastons is a personal blog built with Astro and Tailwind CSS.";
export const EMAIL = "your-email@example.com";
```

## Content Types

### Blog Posts

Add new blog posts as Markdown or MDX files in `src/content/posts/`:

```yaml
---
title: "Your Post Title"
description: "A brief description of your post."
publishedAt: "Dec 24 2024"
---
```

### Bookshelf

Add book entries in `src/content/bookshelf/` to track your reading list.

## Deployment

The site is deployed on [Vercel](https://vercel.com) at [hastons.vercel.app](https://hastons.vercel.app).

## License

This project is open source and available under the [MIT License](LICENSE).
