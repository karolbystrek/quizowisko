import q1 from "./kolos_opracowanie_i2014.json";
import q2 from "./poc_kolokwium_2019_2020.json";
import type { Question } from "@/types/quiz";

export const ALL_QUESTIONS: Question[] = [
  ...(q1 as Question[]),
  ...(q2 as Question[]),
];
