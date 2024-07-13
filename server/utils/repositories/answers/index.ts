import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export class AnswerRepository {
  #prismaClient: PrismaClient;

  constructor() {
    this.#prismaClient = new PrismaClient();
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

  public async findOne(arg: { where: Prisma.AnswerWhereUniqueInput }) {
    const { where } = arg;

    const answer = await this.#prismaClient.answer.findFirst({
      where,
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
}
