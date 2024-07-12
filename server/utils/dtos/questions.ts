import type { Answer, Question, SessionAnswer } from "@prisma/client";
import { AnswerDTOMapper, type AnswerDTO } from "./answers";

export type QuestionDTO = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  answers: AnswerDTO[];
  attempts: {
    count: number;
    success: number;
    rate: number;
  };
};

export abstract class QuestionDTOMapper {
  public static fromQuestion(
    question: Question & {
      answers: Answer[];
      sessionAnswers: (SessionAnswer & {
        answer: Answer;
      })[];
    },
  ): QuestionDTO {
    const count = question.sessionAnswers.length;
    const success = question.sessionAnswers.reduce(
      (prev, curr) => (curr.answer.isCorrect ? prev + 1 : prev),
      0,
    );
    const rate = success / count;

    return {
      id: question.id,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      answers: AnswerDTOMapper.fromAnswers(question.answers),
      attempts: {
        count,
        success,
        rate,
      },
    };
  }

  public static fromQuestions(
    questions: (Question & {
      answers: Answer[];
      sessionAnswers: (SessionAnswer & {
        answer: Answer;
      })[];
    })[],
  ): QuestionDTO[] {
    return questions.map(this.fromQuestion);
  }
}
