import type { Request } from "../../requests";
import type { ResponseError } from "../../responses";

export type IndexHelloData = {
  message: string;
};

export type IndexHelloRequest = Request<IndexHelloData>;

export type IndexHelloError = ResponseError<IndexHelloRequest>;

export type IndexHelloErrorData = IndexHelloError["data"];
