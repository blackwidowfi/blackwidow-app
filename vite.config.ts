import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const config = defineConfig({
  staged: {
    "*": "vp check --fix",
    "*.{ts,tsx,js,jsx,css,json,md}": "vp fmt",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  resolve: { tsconfigPaths: true },
  fmt: {
    sortTailwindcss: {
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortImports: {
      internalPattern: ["#/"],
      customGroups: [
        {
          groupName: "react",
          elementNamePattern: ["react"],
        },
      ],
      groups: [
        "react",
        "builtin",
        "external",
        ["internal", "subpath"],
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
    },
    ignorePatterns: ["src/routeTree.gen.ts"],
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      router: {
        routesDirectory: "app",
      },
    }),
    viteReact(),
  ],
});

export default config;
