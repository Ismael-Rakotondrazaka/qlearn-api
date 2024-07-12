import { faker } from "@faker-js/faker/locale/fr";
import type { Prisma } from "@prisma/client";

const createAnswerData = (arg: {
  refDate: Date;
}): Prisma.AnswerCreateManyQuestionInput[] => {
  const { refDate } = arg;

  return [
    ...faker.helpers.multiple(
      (): Prisma.AnswerCreateManyQuestionInput => {
        return {
          content: `${faker.lorem.words()} (false)`,
          isCorrect: false,
          createdAt: refDate,
          updatedAt: refDate,
        };
      },
      {
        count: 3,
      },
    ),
    {
      content: `${faker.lorem.words()} (true)`,
      isCorrect: true,
      createdAt: refDate,
      updatedAt: refDate,
    },
  ];
};

export const createAnswers = (arg: {
  refDate: Date;
}): Prisma.AnswerCreateNestedManyWithoutQuestionInput => {
  const { refDate } = arg;

  return {
    createMany: {
      data: createAnswerData({
        refDate,
      }),
    },
  };
};
