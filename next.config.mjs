/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    reactCompiler: true,
    staleTimes: {
      dynamic: 300,
    },
  },
};

export default nextConfig;
