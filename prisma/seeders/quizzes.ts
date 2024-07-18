import { faker } from "@faker-js/faker";
import type { Category, Prisma, PrismaClient, Quiz } from "@prisma/client";

export const createQuizzes = async (arg: {
  prismaClient: PrismaClient;
  categories: Category[];
}): Promise<Quiz[]> => {
  const { prismaClient, categories } = arg;

  const quizzes = await prismaClient.quiz.createManyAndReturn({
    data: faker.helpers.multiple(
      (): Prisma.QuizCreateManyInput => {
        const createdAt = faker.date.past();
        return {
          name: faker.lorem.words(),
          description: faker.lorem.sentence(),
          categoryId: faker.helpers.arrayElement(categories).id,
          difficulty: faker.number.int({
            min: 1,
            max: 5,
          }),
          createdAt,
          updatedAt: createdAt,
        };
      },
      {
        count: 10,
      },
    ),
  });

  return quizzes;
};
