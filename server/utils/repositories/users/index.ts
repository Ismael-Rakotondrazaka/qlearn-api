import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "../../prisma";

export class UserRepository {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  public async findOne(arg: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const user = await this.#prismaClient.user.findFirst({
      where,
      orderBy,
    });

    return user;
  }

  public async findMany(arg: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;

    const users = await this.#prismaClient.user.findMany({
      where,
      orderBy,
    });

    return users;
  }

  public async addOne(arg: { data: Prisma.UserCreateArgs["data"] }) {
    const { data } = arg;

    const user = await this.#prismaClient.user.create({
      data,
    });

    return user;
  }

  public async updateOne(arg: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateArgs["data"];
  }) {
    const { where, data } = arg;

    const user = await this.#prismaClient.user.update({
      where,
      data,
    });

    return user;
  }

  public async deleteOne(arg: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = arg;

    await this.#prismaClient.user.delete({
      where,
    });
  }

  public async exist(arg: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = arg;

    const count = await this.#prismaClient.user.count({
      where,
      take: 1,
    });

    return count > 0;
  }
}
