import type { Configuration } from "lint-staged";

const config: Configuration = {
  // Type check TypeScript files
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames: string[]) => [
    `npx eslint ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],

  // Prettify only Markdown and JSON files
  "**/*.(md|json)": (filenames: string[]) =>
    `npx prettier --write ${filenames.join(" ")}`,
};

export default config;
