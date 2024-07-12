import type { Answer } from "@prisma/client";

export type AnswerDTO = {
  id: number;
  content: string;
  isCorrect: boolean;
  questionId: number;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class AnswerDTOMapper {
  public static fromAnswer(answer: Answer): AnswerDTO {
    return {
      id: answer.id,
      content: answer.content,
      isCorrect: answer.isCorrect,
      questionId: answer.questionId,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  }

  public static fromAnswers(answers: Answer[]): AnswerDTO[] {
    return answers.map(this.fromAnswer);
  }
}
