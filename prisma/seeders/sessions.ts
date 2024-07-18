import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient, Quiz, Session, User } from "@prisma/client";
import type { QuestionPerCategory } from "./questions";
import { createSessionAnswersData } from "./sessionAnswers";

const createSessionData = (arg: {
  user: User;
  quizzes: Quiz[];
  questions: QuestionPerCategory;
  refDate: Date;
}): Prisma.SessionCreateInput[] => {
  const { user, questions, refDate, quizzes } = arg;

  return faker.helpers.multiple(
    (): Prisma.SessionCreateInput => {
      const selectedQuiz = faker.helpers.arrayElement(quizzes);

      const selectedQuestions = faker.helpers.arrayElements(
        questions[selectedQuiz.categoryId][selectedQuiz.difficulty],
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
            id: selectedQuiz.id,
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
  questions: QuestionPerCategory;
  users: User[];
  quizzes: Quiz[];
}): Promise<Session[]> => {
  const { prismaClient, questions, users, quizzes } = arg;

  const results: Session[] = [];

  for (const user of users) {
    const sessions = await Promise.all(
      createSessionData({
        user,
        questions,
        quizzes,
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
