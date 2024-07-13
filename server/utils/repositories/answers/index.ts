import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "../../prisma";

export class AnswerRepository {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  public async findOne(arg: {
    where?: Prisma.AnswerWhereInput;
    orderBy?: Prisma.AnswerOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const answer = await this.#prismaClient.answer.findFirst({
      where,
      orderBy,
    });

    return answer;
  }

  public async findMany(arg: {
    where?: Prisma.AnswerWhereInput;
    orderBy?: Prisma.AnswerOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const answers = await this.#prismaClient.answer.findMany({
      where,
      orderBy,
    });

    return answers;
  }

  public async addOne(arg: { data: Prisma.AnswerCreateArgs["data"] }) {
    const { data } = arg;

    const answer = await this.#prismaClient.answer.create({
      data,
    });

    return answer;
  }

  public async updateOne(arg: {
    where: Prisma.AnswerWhereUniqueInput;
    data: Prisma.AnswerUpdateArgs["data"];
  }) {
    const { where, data } = arg;

    const answer = await this.#prismaClient.answer.update({
      where,
      data,
    });

    return answer;
  }

  public async findOneByFk(arg: { questionId: number | undefined }) {
    const { questionId } = arg;
    const question = await this.#prismaClient.question.findUnique({
      where: {
        id: questionId,
      },
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

  public async deleteOne(arg: { where: Prisma.AnswerWhereUniqueInput }) {
    const { where } = arg;

    await this.#prismaClient.answer.delete({
      where,
    });
  }

  public async exist(arg: { where: Prisma.AnswerWhereUniqueInput }) {
    const { where } = arg;

    const count = await this.#prismaClient.answer.count({
      where,
      take: 1,
    });

    return count > 0;
  }

  public async existMany(arg: { where: Prisma.AnswerWhereInput[] }) {
    const { where } = arg;

    const count = await this.#prismaClient.answer.count({
      where: {
        AND: where,
      },
    });

    return count === where.length;
  }
}
