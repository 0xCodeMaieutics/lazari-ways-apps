// import { config } from "dotenv";
// config({
//   path: ".env.local",
// });
// import { PrismaClient } from "@prisma/client";
// import { generateRandomString } from "../lib/random";
// import { encrypt } from "@/utils/encrypt";
// import { UserRole } from "@/utils/models/user";
// const prisma = new PrismaClient();

// const action = process.argv[2];
// const email = process.argv[3];
// const password = process.argv[4];
// void (async function main() {
//   await prisma.$connect();

//   if (
//     action === "create-admin" &&
//     typeof email === "string" &&
//     typeof password === "string"
//   ) {
//     await prisma.user.create({
//       data: {
//         email,
//         name: "Admin",
//         emailVerified: false,
//         role: UserRole.ADMIN,
//         id: generateRandomString(32),
//         accounts: {
//           create: {
//             id: generateRandomString(32),
//             accountId: generateRandomString(32),
//             providerId: "credential",
//             password: encrypt(password, process.env.ENCRYPTION_KEY!),
//           },
//         },
//       },
//     });
//     console.log(`Admin ${email} successfully created ✅`);
//   } else if (action === "delete") {
//     await prisma.user.deleteMany({
//       where: {
//         email,
//       },
//     });
//   } else if (action === "delete-all-tables") {
//     await prisma.user.deleteMany();
//     await prisma.userSettings.deleteMany();
//     await prisma.employer.deleteMany();
//     await prisma.session.deleteMany();
//     await prisma.account.deleteMany();
//     await prisma.verification.deleteMany();
//     await prisma.application.deleteMany();
//   } else if (action === "truncate-applications") {
//     await prisma.application.deleteMany();
//   } else if (action === "truncate-users") {
//     await prisma.user.deleteMany();
//   }

//   await prisma.$disconnect();
// })();
