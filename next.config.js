/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/calendar',
        permanent: true, // Set to true for a 308 permanent redirect
      },
    ];
  },
};