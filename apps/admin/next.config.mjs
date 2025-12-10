const remotePatterns = [];

if (process.env.NODE_ENV === "development") {
  remotePatterns.push({
    protocol: "http",
    hostname: "localhost",
    port: "9000",
    pathname: "/**/*",
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      ...remotePatterns,
      {
        protocol: "https",
        hostname: "lazari-ways-bucket.s3.eu-central-1.amazonaws.com",
        pathname: "/**/*",
      },
    ],
  },
};

export default nextConfig;
