// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { visualizer } from "rollup-plugin-visualizer";

import { SITE_URL } from "./src/consts";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify((await import("./package.json")).version),
    },
    plugins: [
      visualizer({
        emitFile: true,
        filename: "stats.html",
      }),
    ],
  },
});
