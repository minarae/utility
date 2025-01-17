/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/json-editor',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
