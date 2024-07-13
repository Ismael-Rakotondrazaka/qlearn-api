import type { Prisma } from "@prisma/client";
import type { PrismaClient } from "../../prisma";

export class CategoryRepository {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  public async addOne(arg: { data: Prisma.CategoryCreateInput }) {
    const { data } = arg;
    const category = await this.#prismaClient.category.create({
      data,
    });

    return category;
  }

  public async findMany(arg: {
    orderBy?: Prisma.CategoryOrderByWithAggregationInput;
  }) {
    const { orderBy } = arg;
    const categories = await this.#prismaClient.category.findMany({
      orderBy,
    });

    return categories;
  }

  public async findOne(arg: {
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }) {
    const { where, orderBy } = arg;
    const category = await this.#prismaClient.category.findFirst({
      where,
      orderBy,
    });
    return category;
  }

  public async deleteOne(arg: { where: Prisma.CategoryWhereUniqueInput }) {
    const { where } = arg;

    await this.#prismaClient.category.delete({
      where,
    });
  }

  public async updateOne(arg: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateArgs["data"];
  }) {
    const { where, data } = arg;

    const category = await this.#prismaClient.category.update({
      where,
      data,
    });

    return category;
  }
}
