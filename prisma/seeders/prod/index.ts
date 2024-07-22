/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { createQuestions } from "./questions";
import { createSessions } from "./sessions";
import { createUsers } from "./users";

const prismaClient = new PrismaClient();

const main = async () => {
  console.time("=> Total seed duration");

  /* -------------------------------------------------------------------------- */

  console.time("User seed duration");
  const users = await createUsers({
    prismaClient,
  });
  console.timeEnd("User seed duration");

  /* -------------------------------------------------------------------------- */

  console.time("Question seed duration");
  const questions = await createQuestions({
    prismaClient,
  });
  console.timeEnd("Question seed duration");

  /* -------------------------------------------------------------------------- */

  console.time("Session seed duration");
  await createSessions({
    prismaClient,
    questions,
    users,
  });
  console.timeEnd("Session seed duration");

  /* -------------------------------------------------------------------------- */
  console.timeEnd("=> Total seed duration");
};

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
