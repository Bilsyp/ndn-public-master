/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "peach.blender.org",
      },
    ],
  },
};

export default nextConfig;
