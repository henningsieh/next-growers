/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://growagram.com",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    "/account",
    "/profile/edit",
    "/account/grows",
    "/account/grows/create",
  ],
  // FIXME: alternateRefs do not work this way, because loc: path already contains all paths
  // alternateRefs: [
  //   {
  //     href: "https://growagram.com/de",
  //     hreflang: "de",
  //   },
  // ],

  // Default transformation function
  transform: (cfg, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: cfg.changefreq,
      priority: cfg.priority,
      lastmod: cfg.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: cfg.alternateRefs ?? [],
    };
  },

  // additionalPaths: async (config) => [
  //   await config.transform(config, "/additional-page"),
  // ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    // additionalSitemaps: ["https://growagram.com/sitemap-0.xml"], // doubles the default
  },
};

module.exports = config;
