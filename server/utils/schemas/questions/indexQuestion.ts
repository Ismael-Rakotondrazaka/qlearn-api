import type { Simplify } from "type-fest";
import type { QuestionDTO } from "../../dtos";
import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export type IndexQuestionData = {
  questions: QuestionDTO[];
};

export type IndexQuestionRequest = Request<IndexQuestionData>;

export type IndexQuestionError = Simplify<ResponseError<IndexQuestionRequest>>;

export type IndexQuestionErrorData = IndexQuestionError["data"];
