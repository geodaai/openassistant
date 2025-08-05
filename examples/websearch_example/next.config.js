/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@openassistant/places', '@openassistant/utils'],
  },
};

module.exports = nextConfig; 