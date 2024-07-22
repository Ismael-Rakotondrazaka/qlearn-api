import { faker } from "@faker-js/faker";
import type { Answer, Prisma, Question } from "@prisma/client";

export const createSessionAnswersData = (arg: {
  questions: (Question & {
    answers: Answer[];
  })[];
}): {
  data: Prisma.SessionAnswerCreateNestedManyWithoutSessionInput;
  score: number;
} => {
  const { questions } = arg;

  let score: number = 0;

  return {
    data: {
      createMany: {
        data: faker.helpers.multiple(
          (): Prisma.SessionAnswerCreateManySessionInput => {
            const question = faker.helpers.arrayElement(questions);
            const answer = faker.helpers.arrayElement(question.answers);

            if (answer.isCorrect) {
              score++;
            }

            return {
              questionId: question.id,
              selectedAnswerId: answer.id,
            };
          },
        ),
      },
    },
    score,
  };
};
