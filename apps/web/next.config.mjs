/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "ka"],
  },
  locales: ["en", "de", "ka"],
  defaultLocale: "en",
};

export default nextConfig;
