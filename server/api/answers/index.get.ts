import { RepositoryProvider } from "~/server/utils";
import { QuestionDTOMapper } from "~/server/utils/dtos";

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
    const question = await RepositoryProvider.answerRepository.findOneByFk({
      questionId: params.questionId,
    });

    // Handle case where question is not found
    if (question == null) {
      throw Exception.notFound({
        data: {},
        translator,
      });
    }

    // Map the retrieved question to DTO using QuestionDTOMapper
    const mappedQuestion = QuestionDTOMapper.fromQuestion(question);

    // Return the mapped question in the desired format
    return {
      question: mappedQuestion,
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
