import { prismaClient } from "../prisma";
import { AnswerRepository, UserRepository } from "../repositories";
import { CategoryRepository } from "../repositories/categories";
import { QuestionRepository } from "../repositories/questions";
import { SessionRepository } from "../repositories/sessions";

export abstract class RepositoryProvider {
  public static userRepository: UserRepository = new UserRepository(
    prismaClient,
  );

  public static categoryRepository: CategoryRepository = new CategoryRepository(
    prismaClient,
  );

  public static sessionRepository: SessionRepository = new SessionRepository(
    prismaClient,
  );

  public static questionRepository: QuestionRepository = new QuestionRepository(
    prismaClient,
  );

  public static answerRepository: AnswerRepository = new AnswerRepository(
    prismaClient,
  );
}
