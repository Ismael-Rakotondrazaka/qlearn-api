import { PrismaClient as _PrismaClient } from "@prisma/client";

export const prismaClient = new _PrismaClient().$extends({
  result: {
    user: {
      // add fullName field to user
      fullName: {
        needs: {
          firstName: true,
          lastName: true,
        },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
    },
  },
});

export type PrismaClient = typeof prismaClient;
