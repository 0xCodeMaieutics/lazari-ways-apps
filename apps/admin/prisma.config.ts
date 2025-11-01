import { config } from "dotenv";
config({
  path: "./.env.local",
});
import path from "path";
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
  schema: path.join("db", "schema"),
  migrations: {
    path: path.join("db", "migrations"),
    seed: "tsx ./db/seed/index.ts",
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
} satisfies PrismaConfig;
