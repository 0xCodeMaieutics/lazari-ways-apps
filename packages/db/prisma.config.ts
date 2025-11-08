import "dotenv/config";
import path from "path";
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

const PRISMA_FOLDER = "prisma";

export default {
  schema: path.join(PRISMA_FOLDER, "schema"),
  migrations: {
    path: path.join(PRISMA_FOLDER, "migrations"),
    seed: `tsx ./${PRISMA_FOLDER}/seed/index.ts`,
  },
  views: {
    path: path.join(PRISMA_FOLDER, "views"),
  },
  typedSql: {
    path: path.join(PRISMA_FOLDER, "queries"),
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
} satisfies PrismaConfig;
