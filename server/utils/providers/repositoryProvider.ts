import { prismaClient } from "../prisma";
import { UserRepository } from "../repositories";

export abstract class RepositoryProvider {
  public static userRepository: UserRepository = new UserRepository(
    prismaClient,
  );
}
