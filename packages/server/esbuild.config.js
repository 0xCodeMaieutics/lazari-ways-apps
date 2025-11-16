// server/esbuild.config.js
import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

build({
  entryPoints: ["src/auth/index.ts", "src/db/index.ts", "src/db/models.ts"],
  outdir: "dist",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  sourcemap: true,
  splitting: false,
  minify: false,

  // Avoid bundling prisma + other server-only stuff into browser bundle
  external: [
    "@prisma/client",
    "prisma",
    "fs",
    "node:path",
    "node:url",
    "node:process",
    "node:buffer",
    "os",
    "crypto",
    "util",
  ],

  plugins: [
    nodeExternalsPlugin({
      packagePath: "./package.json",
      devDependencies: true, // keep dev deps out
    }),
  ],
})
  .then(() => console.log("✓ server package built for browser use"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
