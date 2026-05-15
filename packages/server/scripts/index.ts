import { zodParse } from "@workspace/shared/error-handling/index";
import z from "zod";
import { createInterface } from "node:readline";
import { prisma } from "../src/db/client.js";
import { read } from "node:fs";
import { accountInfo } from "better-auth/api";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const confirm = async (question: string) => {
  return new Promise<boolean>((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
};

const commandPrefixes = {
  userId: "--userId=",
  action: "--action=",
};
const actions = {
  "delete-user": "delete-user",
};

/**
 * RUN: pnpm tsx scripts/index.ts
 */
void (async function () {
  const args = process.argv.slice(2);

  const actionArg = args.find((arg) => arg.startsWith(commandPrefixes.action));
  const action = actionArg?.slice(commandPrefixes.action.length);
  if (!action) {
    console.error("ACTION_REQUIRED");
    return;
  }

  const userIdArg = args.find((arg) => arg.startsWith(commandPrefixes.userId));
  const userId = userIdArg?.slice(commandPrefixes.userId.length);

  const envResult = zodParse(
    process.env,
    z.object({
      DATABASE_URL: z.string().url(),
    })
  );
  if (envResult.isErr()) {
    console.error("ENV_VARIABLE_PARSE_ERROR", envResult.error);
    return;
  }
  const env = envResult.value;
  console.log(env);
  const confirmResult = await confirm("Are you sure you want to continue?");

  if (!confirmResult) {
    console.log("ACTION_CANCELLED");
    return;
  }

  if (!Object.values(actions).includes(action)) {
    console.error("INVALID_ACTION");
    return;
  }

  if (action === actions["delete-user"] && userId) {
    const employee = await prisma.employee.delete({
      where: {
        userId,
      },
    });
    await prisma.application.deleteMany({
      where: {
        employeeId: employee.id,
      },
    });
    await prisma.s3Object.deleteMany({
      where: {
        employeeId: employee.id,
      },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
  }
})().then(async () => {
  await readline.close();
  await prisma.$disconnect();
});
