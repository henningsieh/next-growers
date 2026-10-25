import type { Configuration } from "lint-staged";

const config: Configuration = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames: readonly string[]) => [
    `npx eslint ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // Prettify Markdown, JSON and YAML files
  "**/*.(md|json)": (filenames: readonly string[]) =>
    `npx prettier --write ${filenames.join(" ")}`,
  "**/*.(yml|yaml)": (filenames: readonly string[]) =>
    `npx prettier --write ${filenames.filter((f) => !f.endsWith("pnpm-lock.yaml")).join(" ")}`,
};

export default config;
