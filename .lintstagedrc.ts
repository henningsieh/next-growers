import type { Configuration } from "lint-staged";

const config: Configuration = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames: string[]) => [
    `npx eslint ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // Prettify Markdown, JSON and YAML files
  "**/*.(md|json)": (filenames: string[]) =>
    `npx prettier --write ${filenames.join(" ")}`,
  "**/*.(yml|yaml)": (filenames: string[]) =>
    `npx prettier --write ${filenames.join(" ")}`,
};

export default config;
