export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
  image?: string; // Optional local path to an image
}