/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "standalone", // <- this enables .next/standalone folder for Docker
};

export default nextConfig;
