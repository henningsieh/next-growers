import type { UserConfig } from "next-i18next/pages";

// NOTE: this file intentionally uses `require` / `module.exports` instead of
// `import` / `export default`. next-i18next loads it via a raw
// `createRequire()(configPath)` call without ESM interop, so the config object
// itself must be `module.exports` (an `export default` would arrive wrapped as
// `{ default: config }` and break `serverSideTranslations`). `import type` is
// fully erased at runtime, so Node can still `require()` this file directly.
// The path is resolved through `I18NEXT_DEFAULT_CONFIG_PATH`, which defaults
// to this file (see next.config.ts).
const path = require("node:path");

const config: UserConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"],
  },
  localePath: path.resolve("./public/locales"),
  react: { useSuspense: false },
};

module.exports = config;
