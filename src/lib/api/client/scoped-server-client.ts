import "server-only";

import { createServerApiClient } from "@/lib/api/client/server-client";
import { createHomeEndpoint } from "@/lib/api/modules/home/endpoint";
import { createLessonsEndpoint } from "@/lib/api/modules/lessons/endpoint";
import { createQuizEndpoint } from "@/lib/api/modules/quiz/endpoint";
import { createUnitsEndpoint } from "@/lib/api/modules/units/endpoint";

const client = createServerApiClient("student");

export const serverStudentApi = {
  home: createHomeEndpoint(client),
  units: createUnitsEndpoint(client),
  lessons: createLessonsEndpoint(client),
  quiz: createQuizEndpoint(client),
};
