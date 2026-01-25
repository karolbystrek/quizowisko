import { useState } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ArrowRight, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import DotGrid from "@/components/DotGrid";
import { useThemeObserver } from "@/hooks/useThemeObserver";
import { RoughBox } from "@/components/ui/RoughBox";
import { QuestionUploadModal } from "@/components/QuestionUploadModal";
import type { Question } from "@/types/quiz";

export function QuizApp() {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
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
  } = useQuiz();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(true);
  const isDark = useThemeObserver();

  const onQuestionsUploaded = (questions: Question[]) => {
    loadQuestions(questions);
    setIsUploadModalOpen(false);
  };

  // Determine colors based on theme
  // Made light mode dots darker (#a1a1aa - Zinc 400) for better visibility
  const dotBaseColor = isDark ? "#27272a" : "#cbd5e1";
  const dotActiveColor = isDark ? "#52525b" : "#a1a1aa";

  if (!currentQuestion && !isFinished) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
            <DotGrid
                className="w-full h-full"
                dotSize={2}
                gap={50}
                baseColor={dotBaseColor}
                activeColor={dotActiveColor}
            />
        </div>
        <div className="animate-pulse text-xl font-medium tracking-widest text-muted-foreground z-10">
          LOADING QUIZ...
        </div>
        {isUploadModalOpen && (
          <QuestionUploadModal 
            onUpload={onQuestionsUploaded} 
          />
        )}
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 animate-in fade-in duration-700 bg-background text-foreground relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
            <DotGrid
                className="w-full h-full"
                dotSize={2}
                gap={50}
                baseColor={dotBaseColor}
                activeColor={dotActiveColor}
            />
        </div>
        <div className="fixed top-6 right-6 z-50 flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleRestart} className="rounded-full" roughShape="circle">
            <RotateCcw className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Reset Quiz</span>
          </Button>
          <ThemeToggle />
        </div>
        <div className="max-w-md w-full text-center space-y-8 z-10 relative">
          <h1 className="text-4xl font-bold tracking-tight">Quiz Complete</h1>

          <div className="py-8 bg-secondary/20 rounded-3xl backdrop-blur-sm">
            <span className="text-8xl font-black block mb-2 text-primary">
              {score}/{totalQuestions}
            </span>
            <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">
              Final Score
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full px-4">
            <Button
              onClick={handleRestart}
              size="lg"
              roughShape="rounded"
              roughCornerRadius={16}
              className="w-full text-lg h-14 font-semibold tracking-wide rounded-2xl transition-all"
            >
              Start New Quiz
            </Button>

            {wrongQuestions.length > 0 && (
              <Button
                onClick={handleRetryWrong}
                variant="outline"
                size="lg"
                roughShape="rounded"
                roughCornerRadius={16}
                className="w-full text-lg h-14 font-medium tracking-wide rounded-2xl border-2 border-dashed hover:border-primary hover:text-primary transition-all bg-background/50 backdrop-blur-sm"
              >
                Retry Wrong Questions ({wrongQuestions.length})
              </Button>
            )}

            <Button
              onClick={() => setIsUploadModalOpen(true)}
              variant="ghost"
              size="sm"
              className="mt-4 text-muted-foreground hover:text-foreground"
            >
              Upload New Questions
            </Button>
          </div>
        </div>
        {isUploadModalOpen && (
          <QuestionUploadModal 
            onUpload={onQuestionsUploaded} 
          />
        )}
      </div>
    );
  }

  // Active Quiz UI
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
          <DotGrid
              className="w-full h-full"
              dotSize={2}
              gap={50}
              baseColor={dotBaseColor}
              activeColor={dotActiveColor}
          />
      </div>

      {/* Top Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <Button variant="ghost" size="icon" onClick={handleRestart} className="rounded-full" roughShape="circle">
          <RotateCcw className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Reset Quiz</span>
        </Button>
        <ThemeToggle />
      </div>

      {/* Main Content Wrapper - Centered and Width Constrained */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto p-6 md:p-12 z-10 relative">

        <div className="animate-in slide-in-from-bottom-8 duration-500 w-full">
          {/* Progress & Question Number */}
          <div className="mb-8 flex justify-between items-end border-b-2 border-border/60 pb-4">
            <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
              Question {currentQuestionIndex + 1}
            </span>
            <span className="text-sm font-medium text-muted-foreground/60">
              of {totalQuestions}
            </span>
          </div>

          {/* Question Text */}
          <div className="min-h-[120px] flex items-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-foreground drop-shadow-sm">
              {currentQuestion?.question}
            </h2>
          </div>

          {/* Answers List */}
          <div className="grid gap-4 mb-12">
            {currentQuestion?.answers.map((answer, index) => {
              const isSelected = selectedAnswers.includes(index);
              const isCorrect = answer.isCorrect;
              
              let strokeColor = "transparent";
              let bgClass = "bg-secondary/50 hover:bg-secondary/80";
              let textStyles = "text-muted-foreground group-hover:text-foreground";

              if (isSubmitted) {
                if (isCorrect) {
                   strokeColor = "#22c55e";
                   bgClass = "bg-green-500/10";
                   textStyles = "text-foreground font-bold";
                } else if (isSelected && !isCorrect) {
                   strokeColor = "#ef4444"; // Explicit Red
                   bgClass = "bg-destructive/10";
                   textStyles = "text-foreground font-medium";
                } else {
                   strokeColor = "transparent";
                   bgClass = "opacity-40 bg-secondary/30 grayscale";
                }
              } else if (isSelected) {
                 strokeColor = isDark ? "#ffffff" : "#000000"; // Explicit White/Black
                 bgClass = "bg-primary/10 shadow-sm";
                 textStyles = "text-foreground font-medium";
              }

              return (
                <RoughBox
                  key={index}
                  onClick={() => !isSubmitted && handleAnswerToggle(index)}
                  shape="rounded"
                  cornerRadius={16}
                  roughness={2}
                  strokeWidth={2}
                  stroke={strokeColor}
                  className={cn(
                    "group relative p-5 cursor-pointer transition-all duration-200 rounded-2xl backdrop-blur-[2px]",
                    bgClass,
                    isSubmitted && "cursor-default"
                  )}
                >
                  <div className="relative z-10 flex items-center w-full">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => !isSubmitted && handleAnswerToggle(index)}
                        stroke={isSelected 
                            ? (isDark ? "#ffffff" : "#000000") 
                            : (isDark ? "#71717a" : "#a1a1aa")
                        }
                        className={cn(
                        "mr-5 h-5 w-5",
                        isSubmitted && "pointer-events-none" 
                        )}
                    />
                    <span className={cn(
                        "text-lg md:text-2xl transition-colors flex-1 leading-snug",
                        textStyles
                    )}>
                        {answer.text}
                    </span>
                  </div>
                </RoughBox>
              );
            })}
          </div>

          {/* Action Button */}
          <div className={cn(
            "flex justify-end transition-all duration-300 ease-out",
            (selectedAnswers.length > 0 || isSubmitted)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          )}>
               <Button
                onClick={isSubmitted ? handleNext : handleSubmit}
                disabled={!isSubmitted && selectedAnswers.length === 0}
                tabIndex={(selectedAnswers.length > 0 || isSubmitted) ? 0 : -1}
                size="lg"
                roughShape="rounded"
                roughCornerRadius={16}
                                className={cn(
                                  "w-full md:w-auto min-w-[200px] h-16 text-lg rounded-2xl transition-all duration-300",
                                  isSubmitted 
                                    ? "bg-primary text-primary-foreground font-bold active:scale-95" 
                                    : "bg-primary text-primary-foreground font-semibold tracking-wide active:scale-95"
                                )}              >
                {isSubmitted ? (
                  <span className="flex items-center gap-2">
                    Next Question <ArrowRight className="h-5 w-5" />
                  </span>
                ) : (
                  "Check Answer"
                )}
              </Button>
            </div>

        </div>
      </div>
      {isUploadModalOpen && (
        <QuestionUploadModal 
          onUpload={onQuestionsUploaded} 
        />
      )}
    </div>
  );
}
