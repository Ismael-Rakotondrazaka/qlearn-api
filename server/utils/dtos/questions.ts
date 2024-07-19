import { faker } from "@faker-js/faker";
import type {
  Answer,
  Category,
  Question,
  Quiz,
  SessionAnswer,
} from "@prisma/client";
import type { AnswerDTO } from "./answers";
import { AnswerDTOMapper } from "./answers";
import { QuizDTOMapper, type QuizDTO } from "./quizzes";

export type QuestionDTO = {
  id: number;
  content: string;
  quiz: QuizDTO;
  createdAt: Date;
  updatedAt: Date;
  answers: AnswerDTO[];
  _sessionAnswers: {
    count: number;
    success: number;
    rate: number;
  };
};

export abstract class QuestionDTOMapper {
  public static fromQuestion(
    question: Question & {
      quiz: Quiz & {
        category: Category & {
          _count: {
            quizzes: number;
          };
        };
        _count: {
          sessions: number;
        };
      };
      answers: Answer[];
      sessionAnswers: (SessionAnswer & {
        selectedAnswer: Answer;
      })[];
    },
  ): QuestionDTO {
    const count = question.sessionAnswers.length;
    const success = question.sessionAnswers.reduce(
      (prev, curr) => (curr.selectedAnswer.isCorrect ? prev + 1 : prev),
      0,
    );
    const rate = count > 0 ? (success / count) * 100 : 0; // Avoid division by zero

    return {
      id: question.id,
      content: question.content,
      quiz: QuizDTOMapper.fromQuiz(question.quiz),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      answers: faker.helpers.shuffle(
        AnswerDTOMapper.fromAnswers(question.answers),
      ),
      _sessionAnswers: {
        count,
        success,
        rate,
      },
    };
  }

  public static fromQuestions(
    questions: (Question & {
      quiz: Quiz & {
        category: Category & {
          _count: {
            quizzes: number;
          };
        };
        _count: {
          sessions: number;
        };
      };
      answers: Answer[];
      sessionAnswers: (SessionAnswer & {
        selectedAnswer: Answer;
      })[];
    })[],
  ): QuestionDTO[] {
    return questions.map(this.fromQuestion);
  }
}
