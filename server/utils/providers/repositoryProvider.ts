import { prismaClient } from "../prisma";
import { UserRepository } from "../repositories";
import { AnswerRepository } from "../repositories/answers";
import { CategoryRepository } from "../repositories/categories";

export abstract class RepositoryProvider {
  public static userRepository: UserRepository = new UserRepository(
    prismaClient,
  );

  public static categoryRepository: CategoryRepository =
    new CategoryRepository();

  public static answerRepository: AnswerRepository = new AnswerRepository();
}
