import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/types/quiz";

interface UseQuizReturn {
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswers: number[]; // Indices of selected answers for the current question
  isFinished: boolean;
  score: number;
  wrongQuestions: Question[];
  isSubmitted: boolean;
  handleAnswerToggle: (answerIndex: number) => void;
  handleSubmit: () => void;
  handleNext: () => void;
  handleRestart: () => void;
  handleRetryWrong: () => void;
  loadQuestions: (newQuestions: Question[]) => void;
  progress: number;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function useQuiz(): UseQuizReturn {
  const [baseQuestions, setBaseQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("quiz_questions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBaseQuestions(parsed);
          setQuestions(shuffleArray(parsed));
        }
      } catch (e) {
        console.error("Failed to parse saved questions", e);
      }
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const handleAnswerToggle = useCallback((answerIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => {
      if (prev.includes(answerIndex)) {
        return prev.filter((i) => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  }, [isSubmitted]);

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || isSubmitted) return;

    // Check correctness
    const correctIndices = currentQuestion.answers
      .map((a, i) => (a.isCorrect ? i : -1))
      .filter((i) => i !== -1);
    
    const sortedSelected = [...selectedAnswers].sort((a, b) => a - b);
    const sortedCorrect = [...correctIndices].sort((a, b) => a - b);

    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, index) => val === sortedCorrect[index]);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQuestion]);
    }

    setIsSubmitted(true);
  }, [currentQuestion, isSubmitted, selectedAnswers]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setQuestions(shuffleArray(baseQuestions));
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setWrongQuestions([]);
    setIsFinished(false);
    setIsSubmitted(false);
  }, [baseQuestions]);

  const handleRetryWrong = useCallback(() => {
    if (wrongQuestions.length === 0) {
      handleRestart();
      return;
    }
    setQuestions(shuffleArray(wrongQuestions));
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setWrongQuestions([]);
    setIsFinished(false);
    setIsSubmitted(false);
  }, [wrongQuestions, handleRestart]);

  const loadQuestions = useCallback((newQuestions: Question[]) => {
    localStorage.setItem("quiz_questions", JSON.stringify(newQuestions));
    setBaseQuestions(newQuestions);
    setQuestions(shuffleArray(newQuestions));
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setWrongQuestions([]);
    setIsFinished(false);
    setIsSubmitted(false);
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    selectedAnswers,
    isFinished,
    score,
    wrongQuestions,
    isSubmitted,
    handleAnswerToggle,
    handleSubmit,
    handleNext,
    handleRestart,
    handleRetryWrong,
    loadQuestions,
    progress: (currentQuestionIndex / (questions.length || 1)) * 100,
  };
}