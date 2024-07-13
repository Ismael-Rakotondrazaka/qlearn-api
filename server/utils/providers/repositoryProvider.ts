import { prismaClient } from "../prisma";
import { UserRepository } from "../repositories";
import { CategoryRepository } from "../repositories/categories";

export abstract class RepositoryProvider {
  public static userRepository: UserRepository = new UserRepository(
    prismaClient,
  );

  public static categoryRepository: CategoryRepository = new CategoryRepository(
    prismaClient,
  );
}
