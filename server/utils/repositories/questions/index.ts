import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "../../prisma";

export class QuestionRepository {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  public async findOne(arg: {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const question = await this.#prismaClient.question.findFirst({
      where,
      orderBy,
      include: {
        category: true,
        answers: true,
        sessionAnswers: {
          include: {
            selectedAnswer: true,
          },
        },
      },
    });

    return question;
  }

  public async findMany(arg: {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const questions = await this.#prismaClient.question.findMany({
      where,
      orderBy,
      include: {
        category: true,
        answers: true,
        sessionAnswers: {
          include: {
            selectedAnswer: true,
          },
        },
      },
    });

    return questions;
  }

  public async addOne(arg: { data: Prisma.QuestionCreateArgs["data"] }) {
    const { data } = arg;

    const question = await this.#prismaClient.question.create({
      data,
      include: {
        category: true,
        answers: true,
        sessionAnswers: {
          include: {
            selectedAnswer: true,
          },
        },
      },
    });

    return question;
  }

  public async updateOne(arg: {
    where: Prisma.QuestionWhereUniqueInput;
    data: Prisma.QuestionUpdateArgs["data"];
  }) {
    const { where, data } = arg;

    const question = await this.#prismaClient.question.update({
      where,
      data,
      include: {
        category: true,
        answers: true,
        sessionAnswers: {
          include: {
            selectedAnswer: true,
          },
        },
      },
    });

    return question;
  }

  public async deleteOne(arg: { where: Prisma.QuestionWhereUniqueInput }) {
    const { where } = arg;

    await this.#prismaClient.question.delete({
      where,
    });
  }

  public async exist(arg: { where: Prisma.QuestionWhereUniqueInput }) {
    const { where } = arg;

    const count = await this.#prismaClient.question.count({
      where,
      take: 1,
    });

    return count > 0;
  }
}
