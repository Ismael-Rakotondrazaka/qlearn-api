import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "../../prisma";

export class QuizRepository {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  public async findOne(arg: {
    where?: Prisma.QuizWhereInput;
    orderBy?: Prisma.QuizOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const quiz = await this.#prismaClient.quiz.findFirst({
      where,
      orderBy,
      include: {
        category: {
          include: {
            _count: {
              select: {
                quizzes: true,
              },
            },
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    return quiz;
  }

  public async findMany(arg: {
    where?: Prisma.QuizWhereInput;
    orderBy?:
      | Prisma.QuizOrderByWithRelationInput
      | Prisma.QuizOrderByWithRelationInput[];
  }) {
    const { where, orderBy } = arg;

    const quizzes = await this.#prismaClient.quiz.findMany({
      where,
      orderBy,
      include: {
        category: {
          include: {
            _count: {
              select: {
                quizzes: true,
              },
            },
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    return quizzes;
  }

  public async addOne(arg: { data: Prisma.QuizCreateArgs["data"] }) {
    const { data } = arg;

    const quiz = await this.#prismaClient.quiz.create({
      data,
      include: {
        category: {
          include: {
            _count: {
              select: {
                quizzes: true,
              },
            },
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    return quiz;
  }

  public async updateOne(arg: {
    where: Prisma.QuizWhereUniqueInput;
    data: Prisma.QuizUpdateArgs["data"];
  }) {
    const { where, data } = arg;

    const quiz = await this.#prismaClient.quiz.update({
      where,
      data,
      include: {
        category: {
          include: {
            _count: {
              select: {
                quizzes: true,
              },
            },
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    return quiz;
  }

  public async deleteOne(arg: { where: Prisma.QuizWhereUniqueInput }) {
    const { where } = arg;

    await this.#prismaClient.quiz.delete({
      where,
    });
  }

  public async exist(arg: { where: Prisma.QuizWhereUniqueInput }) {
    const { where } = arg;

    const count = await this.#prismaClient.quiz.count({
      where,
      take: 1,
    });

    return count > 0;
  }
}
