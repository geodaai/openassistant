/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};
