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
  transpilePackages: ["@workspace/ui", "@workspace/shared"],
  images: {
    // domains: ["127.0.0.1", "localhost"], // 👈 Add this line
    remotePatterns,
  },
};

export default nextConfig;
