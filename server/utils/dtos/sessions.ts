import type { Session, User } from "@prisma/client";
import { UserDTOMapper, type UserDTO } from "./users";

export type SessionDTO = {
  id: number;
  score: number;
  quizId: number;
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
    },
  ): SessionDTO {
    return {
      id: question.id,
      quizId: question.quizId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      score: question.score,
      user: UserDTOMapper.fromUser(question.user),
    };
  }

  public static fromSessions(
    questions: (Session & {
      user: User & {
        fullName: string;
      };
    })[],
  ): SessionDTO[] {
    return questions.map(this.fromSession);
  }
}
