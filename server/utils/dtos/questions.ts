import type { Answer, Category, Question, SessionAnswer } from "@prisma/client";
import type { AnswerDTO } from "./answers";
import { AnswerDTOMapper } from "./answers";
import { CategoryDTOMapper } from "./categories";
export type QuestionDTO = {
  id: number;
  content: string;
  difficulty: number;
  category: CategoryDTO;
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
      category: Category;
      answers: Answer[];
      sessionAnswers: (SessionAnswer & {
        selectedAnswer: Answer; // Use selectedAnswer here
      })[];
    },
  ): QuestionDTO {
    const count = question.sessionAnswers.length;
    const success = question.sessionAnswers.reduce(
      (prev, curr) => (curr.selectedAnswer.isCorrect ? prev + 1 : prev),
      0,
    );
    const rate = count > 0 ? success / count : 0; // Avoid division by zero

    return {
      id: question.id,
      content: question.content,
      difficulty: question.difficulty,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      category: CategoryDTOMapper.fromCategory(question.category),
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
      category: Category;
      answers: Answer[];
      sessionAnswers: (SessionAnswer & {
        selectedAnswer: Answer;
      })[];
    })[],
  ): QuestionDTO[] {
    return questions.map(this.fromQuestion);
  }
}
