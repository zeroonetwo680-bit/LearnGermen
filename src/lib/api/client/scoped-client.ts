import { createBrowserApiClient } from "@/lib/api/client/browser-client";
import { createHomeEndpoint } from "@/lib/api/modules/home/endpoint";
import { createLessonsEndpoint } from "@/lib/api/modules/lessons/endpoint";
import { createQuizEndpoint } from "@/lib/api/modules/quiz/endpoint";
import { createUnitsEndpoint } from "@/lib/api/modules/units/endpoint";

const client = createBrowserApiClient("student");

export const studentApi = {
  home: createHomeEndpoint(client),
  units: createUnitsEndpoint(client),
  lessons: createLessonsEndpoint(client),
  quiz: createQuizEndpoint(client),
};
