import { faker } from "@faker-js/faker";
import type { Answer, PrismaClient, Question } from "@prisma/client";
import { questionDatas } from "./data/question";

export type QuestionsPerQuiz = Record<
  number,
  (Question & {
    answers: Answer[];
  })[]
>;

export const createQuestions = async (arg: {
  prismaClient: PrismaClient;
}): Promise<QuestionsPerQuiz> => {
  const { prismaClient } = arg;

  const result: QuestionsPerQuiz = {};

  for (const entry of questionDatas) {
    const { category: categoryData, quiz: quizData, questions } = entry;

    // Create category
    const category = await prismaClient.category.create({
      data: {
        name: categoryData.name,
      },
    });

    const refDate = faker.date.past();

    // Create quiz
    const quiz = await prismaClient.quiz.create({
      data: {
        name: quizData.name,
        description: quizData.description,
        difficulty: quizData.difficulty,
        categoryId: category.id,
        createdAt: refDate,
        updatedAt: refDate,
        questions: {
          create: questions.map((question) => ({
            content: question.content,
            createdAt: refDate,
            updatedAt: refDate,
            answers: {
              create: question.answers.map((answer) => ({
                content: answer.content,
                isCorrect: answer.isCorrect,
                createdAt: refDate,
                updatedAt: refDate,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    result[quiz.id] = quiz.questions;
  }

  return result;
};
