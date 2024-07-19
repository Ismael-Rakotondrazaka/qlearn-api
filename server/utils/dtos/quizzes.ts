import type { Category, Quiz } from "@prisma/client";
import type { CategoryDTO } from "./categories";
import { CategoryDTOMapper } from "./categories";

export type QuizDTO = {
  id: number;
  name: string;
  category: CategoryDTO;
  difficulty: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    sessions: number;
  };
};

export abstract class QuizDTOMapper {
  public static fromQuiz(
    quiz: Quiz & {
      category: Category & {
        _count: {
          quizzes: number;
        };
      };
      _count: {
        sessions: number;
      };
    },
  ): QuizDTO {
    return {
      id: quiz.id,
      difficulty: quiz.difficulty,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      description: quiz.description,
      name: quiz.name,
      category: CategoryDTOMapper.fromCategory(quiz.category),
      _count: {
        sessions: quiz._count.sessions,
      },
    };
  }

  public static fromQuizzes(
    quizzes: (Quiz & {
      category: Category & {
        _count: {
          quizzes: number;
        };
      };
      _count: {
        sessions: number;
      };
    })[],
  ): QuizDTO[] {
    return quizzes.map(this.fromQuiz);
  }
}
