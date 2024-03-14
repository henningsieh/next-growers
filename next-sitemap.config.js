/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://growagram.com",
  generateRobotsTxt: true, // (optional)
  // ...other options
};
