import { faker } from "@faker-js/faker/locale/fr";
import type {
  Answer,
  Prisma,
  PrismaClient,
  Question,
  Quiz,
} from "@prisma/client";
import { createAnswers } from "./answers";

export type QuestionsPerQuiz = Record<
  number,
  (Question & {
    answers: Answer[];
  })[]
>;

const createQuestionData = (arg: {
  quiz: Quiz;
}): Prisma.QuestionCreateArgs["data"][] => {
  const { quiz } = arg;

  return faker.helpers.multiple(
    (): Prisma.QuestionCreateArgs["data"] => {
      const createdAt = faker.date.past();

      return {
        content: faker.lorem.sentence(),
        createdAt,
        updatedAt: createdAt,
        quizId: quiz.id,
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
  quizzes: Quiz[];
}): Promise<QuestionsPerQuiz> => {
  const { prismaClient, quizzes } = arg;

  const result: QuestionsPerQuiz = {};

  for (const quiz of quizzes) {
    result[quiz.id] = await Promise.all(
      createQuestionData({
        quiz,
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

  return result;
};
