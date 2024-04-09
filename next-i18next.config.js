// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"],
  },
  localePath: path.resolve("./public/locales"),
  react: { useSuspense: false },
};
