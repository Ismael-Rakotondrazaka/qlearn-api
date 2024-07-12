import type { Category, Session, User } from "@prisma/client";
import { UserDTOMapper, type UserDTO } from "./users";

export type SessionDTO = {
  id: number;
  category: Category;
  difficulty: number;
  score: number;
  user: UserDTO;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class SessionDTOMapper {
  public static fromSession(
    question: Session & {
      user: User & {
        fullName: string;
      };
      category: Category;
    },
  ): SessionDTO {
    return {
      id: question.id,
      category: question.category,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      difficulty: question.difficulty,
      score: question.score,
      user: UserDTOMapper.fromUser(question.user),
    };
  }

  public static fromSessions(
    questions: (Session & {
      user: User & {
        fullName: string;
      };
      category: Category;
    })[],
  ): SessionDTO[] {
    return questions.map(this.fromSession);
  }
}
