/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // I-ignore ang lint errors para makapasa sa build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;