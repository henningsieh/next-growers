const path = require("path");

const config = {
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"],
  },
  localePath: path.resolve("./public/locales"),
  react: { useSuspense: false },
};

module.exports = config;
