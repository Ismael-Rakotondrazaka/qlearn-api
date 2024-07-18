import { faker } from "@faker-js/faker/locale/fr";
import type { Category, Prisma, PrismaClient } from "@prisma/client";

export const createCategories = async (arg: {
  prismaClient: PrismaClient;
}): Promise<Category[]> => {
  const { prismaClient } = arg;

  const categories = await prismaClient.category.createManyAndReturn({
    data: faker.helpers.multiple(
      (): Prisma.CategoryCreateArgs["data"] => {
        const createdAt = faker.date.past();
        return {
          name: faker.lorem.word(),
          createdAt,
          updatedAt: createdAt,
        };
      },
      {
        count: 3,
      },
    ),
  });

  return categories;
};
