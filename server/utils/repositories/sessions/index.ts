import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "../../prisma";

export class SessionRepository {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  public async findOne(arg: {
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const session = await this.#prismaClient.session.findFirst({
      where,
      orderBy,
      include: {
        user: true,
        category: true,
      },
    });

    return session;
  }

  public async findMany(arg: {
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const sessions = await this.#prismaClient.session.findMany({
      where,
      orderBy,
      include: {
        user: true,
        category: true,
      },
    });

    return sessions;
  }

  public async addOne(arg: { data: Prisma.SessionCreateArgs["data"] }) {
    const { data } = arg;

    const session = await this.#prismaClient.session.create({
      data,
      include: {
        user: true,
        category: true,
      },
    });

    return session;
  }

  public async updateOne(arg: {
    where: Prisma.SessionWhereUniqueInput;
    data: Prisma.SessionUpdateArgs["data"];
  }) {
    const { where, data } = arg;

    const session = await this.#prismaClient.session.update({
      where,
      data,
      include: {
        user: true,
        category: true,
      },
    });

    return session;
  }

  public async deleteOne(arg: { where: Prisma.SessionWhereUniqueInput }) {
    const { where } = arg;

    await this.#prismaClient.session.delete({
      where,
    });
  }

  public async exist(arg: { where: Prisma.SessionWhereUniqueInput }) {
    const { where } = arg;

    const count = await this.#prismaClient.session.count({
      where,
      take: 1,
    });

    return count > 0;
  }
}
