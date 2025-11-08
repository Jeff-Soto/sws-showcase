/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/lab",
      "@mui/icons-material",
      "@mui/system",
      "@mui/x-data-grid",
    ],
  },
};

export default nextConfig;
