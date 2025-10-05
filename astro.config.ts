// @ts-check
import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"


import singleFile from "astro-single-file";


export default defineConfig({
  integrations: [icon(), (await import("@playform/compress")).default() 
	// , singleFile()
	],

  vite: {
    build: {
      sourcemap: false,
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
