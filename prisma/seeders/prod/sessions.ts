import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, Session, User } from "@prisma/client";
import type { QuestionsPerQuiz } from "./questions";
import { createSessionAnswersData } from "./sessionAnswers";

const createSessionData = (arg: {
  user: User;
  questions: QuestionsPerQuiz;
  refDate: Date;
}): Prisma.SessionCreateInput[] => {
  const { user, questions, refDate } = arg;

  return faker.helpers.multiple(
    (): Prisma.SessionCreateInput => {
      const selectedQuizId = +faker.helpers.arrayElement(
        Object.keys(questions),
      );

      const selectedQuestions = faker.helpers.arrayElements(
        questions[selectedQuizId],
        10,
      );

      const createdAt = faker.date.future({
        refDate,
      });
      const { data: sessionAnswers, score } = createSessionAnswersData({
        questions: selectedQuestions,
      });

      return {
        quiz: {
          connect: {
            id: selectedQuizId,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        createdAt,
        updatedAt: createdAt,
        sessionAnswers,
        score,
      };
    },
    {
      count: faker.number.int({
        min: 3,
        max: 10,
      }),
    },
  );
};

export const createSessions = async (arg: {
  prismaClient: PrismaClient;
  questions: QuestionsPerQuiz;
  users: User[];
}): Promise<Session[]> => {
  const { prismaClient, questions, users } = arg;

  const results: Session[] = [];

  for (const user of users) {
    const sessions = await Promise.all(
      createSessionData({
        user,
        questions,
        refDate: user.createdAt,
      }).map((data) =>
        prismaClient.session.create({
          data,
        }),
      ),
    );

    results.push(...sessions);
  }

  return results;
};
