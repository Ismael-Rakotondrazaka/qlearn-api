import { faker } from "@faker-js/faker";
import type { StartSessionRequest } from "~/server/utils";
import { RepositoryProvider, StartSessionBodySchema } from "~/server/utils";
import { QuestionDTOMapper } from "~/server/utils/dtos";

const __handler__: ToEventHandler<StartSessionRequest> = async (event) => {
  const translator = await Translator.new(event);

  try {
    const validator = new Validator(translator);
    const requestInputGetter = new RequestInputGetter(event, validator);

    const body = await requestInputGetter.getValidatedBody(
      StartSessionBodySchema,
    );

    // TODO verify if categoryId exists

    const selectedQuestions = await RepositoryProvider.questionRepository
      .findMany({
        where: {
          quizId: body.quizId,
        },
      })
      .then((questions) => faker.helpers.arrayElements(questions, 10));

    const questionDTOs = QuestionDTOMapper.fromQuestions(selectedQuestions);

    return {
      questions: questionDTOs,
    };
  } catch (error) {
    throw Exception.fromUnknown({
      error,
      event,
      translator,
    }).getNuxtError();
  }
};

export default defineEventHandler(__handler__);
