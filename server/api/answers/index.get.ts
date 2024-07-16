import { RepositoryProvider } from "~/server/utils";
import { AnswerDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<IndexAnswerRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    // Validate input and retrieve parameters
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);
    const params = await requestInputGetter.getValidatedQueries(
      IndexAnswerQuerySchema,
    );

    // Retrieve question from repository based on questionId
    const answers = await RepositoryProvider.answerRepository.findMany({
      where: {
        questionId: params.questionId,
      },
    });

    // Map the retrieved answer to DTO using QuestionDTOMapper
    const mappedAnswers = AnswerDTOMapper.fromAnswers(answers);

    // Return the mapped answer in the desired format
    return {
      answers: mappedAnswers,
    };
  } catch (error) {
    // Handle and rethrow exceptions
    throw Exception.fromUnknown({
      error,
      event,
      translator,
    }).getNuxtError();
  }
};

export default defineEventHandler(__handler__);
