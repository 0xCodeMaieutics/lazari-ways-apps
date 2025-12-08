import { exec as childProcessExec } from "node:child_process";
import { config } from "dotenv";
import util from "node:util";
const exec = util.promisify(childProcessExec);

export const setup = async () => {
  config({
    path: ".env.test",
  });
  await exec("pnpm prisma migrate deploy");
};

export const teardown = async () => {
  await exec("pnpm prisma migrate reset --force --skip-seed");
};
