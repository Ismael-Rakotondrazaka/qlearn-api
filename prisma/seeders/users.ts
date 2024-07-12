import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, User } from "@prisma/client";
import { hashSync } from "bcrypt";

const hashPassword = (password: string = "password"): string => {
  return hashSync(password, 10);
};

const createUserData = (
  isAdmin: boolean = false,
): Prisma.UserCreateManyInput => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({
    firstName,
    lastName,
  });
  const createdAt = faker.date.past();

  return {
    email,
    firstName,
    lastName,
    password: hashPassword(),
    role: isAdmin ? "admin" : "user",
    createdAt,
    updatedAt: createdAt,
  };
};

export const createUsers = async (arg: {
  prismaClient: PrismaClient;
}): Promise<User[]> => {
  const { prismaClient } = arg;

  const users = await prismaClient.user.createManyAndReturn({
    data: [
      createUserData(true),
      ...faker.helpers.multiple(createUserData, {
        count: 5,
      }),
    ],
  });

  return users;
};
