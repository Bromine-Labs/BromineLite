// @ts-check
import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"

import partytown from "@astrojs/partytown";


import singleFile from "astro-single-file";


export default defineConfig({
  integrations: [icon(), (await import("@playform/compress")).default(), partytown(), singleFile()],

  vite: {
    build: {
      sourcemap: true,
    },
    css: {
      devSourcemap: true,
    },
    plugins: [tailwindcss()],
  },

  experimental: {
    preserveScriptOrder: true,
  },
})