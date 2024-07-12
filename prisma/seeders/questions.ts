import { faker } from "@faker-js/faker/locale/fr";
import type {
  Answer,
  Category,
  Prisma,
  PrismaClient,
  Question,
} from "@prisma/client";
import { createAnswers } from "./answers";

export type QuestionPerLevel = Record<
  number,
  (Question & {
    answers: Answer[];
  })[]
>;

export type QuestionPerCategory = Record<number, QuestionPerLevel>;

const createQuestionData = (arg: {
  difficulty: number;
  categoryId: number;
}): Prisma.QuestionCreateArgs["data"][] => {
  const { categoryId, difficulty } = arg;

  return faker.helpers.multiple(
    (): Prisma.QuestionCreateArgs["data"] => {
      const createdAt = faker.date.past();

      return {
        difficulty,
        content: faker.lorem.sentence(),
        createdAt,
        updatedAt: createdAt,
        category: {
          connect: {
            id: categoryId,
          },
        },
        answers: createAnswers({
          refDate: createdAt,
        }),
      };
    },
    {
      count: 15,
    },
  );
};

export const createQuestions = async (arg: {
  prismaClient: PrismaClient;
  categories: Category[];
}): Promise<QuestionPerCategory> => {
  const { prismaClient, categories } = arg;

  const result: QuestionPerCategory = {};

  for (const category of categories) {
    const questionPerLevel: QuestionPerLevel = {};

    for (let level = 1; level <= 5; level++) {
      questionPerLevel[level] = await Promise.all(
        createQuestionData({
          categoryId: category.id,
          difficulty: level,
        }).map((data) =>
          prismaClient.question.create({
            data,
            include: {
              answers: true,
            },
          }),
        ),
      );
    }

    result[category.id] = questionPerLevel;
  }

  return result;
};
