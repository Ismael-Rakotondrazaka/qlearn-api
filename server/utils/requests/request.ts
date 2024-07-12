export interface Request<
  TOutput = Record<string, never>,
  TBody = Record<string, never>,
  TParams extends Record<string, string | number | never> = Record<
    string,
    never
  >,
  TQuery = Record<string, never>,
> {
  input: {
    body: TBody;
    query: TQuery;
    params: TParams;
  };
  output: Promise<TOutput>;
}
