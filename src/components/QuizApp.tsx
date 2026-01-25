import { useQuiz } from "@/hooks/useQuiz";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import DotGrid from "@/components/DotGrid";
import { useThemeObserver } from "@/hooks/useThemeObserver";

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
  } = useQuiz();

  const isDark = useThemeObserver();

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
                gap={24}
                baseColor={dotBaseColor}
                activeColor={dotActiveColor}
            />
        </div>
        <div className="animate-pulse text-xl font-medium tracking-widest text-muted-foreground z-10">
          LOADING QUIZ...
        </div>
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
                gap={24}
                baseColor={dotBaseColor}
                activeColor={dotActiveColor}
            />
        </div>
        <div className="fixed top-6 right-6 z-50">
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
              className="w-full text-lg h-14 font-semibold tracking-wide rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Start New Quiz
            </Button>
            
            {wrongQuestions.length > 0 && (
              <Button 
                onClick={handleRetryWrong} 
                variant="outline" 
                size="lg"
                className="w-full text-lg h-14 font-medium tracking-wide rounded-2xl border-2 border-dashed hover:border-primary hover:text-primary transition-all bg-background/50 backdrop-blur-sm"
              >
                Retry Wrong Questions ({wrongQuestions.length})
              </Button>
            )}
          </div>
        </div>
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
              gap={24}
              baseColor={dotBaseColor}
              activeColor={dotActiveColor}
          />
      </div>
      
      {/* Fixed Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
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
              
              let containerStyles = "border-2 border-transparent bg-secondary/50 hover:bg-secondary/80";
              let textStyles = "text-muted-foreground group-hover:text-foreground";
              let icon = null;

              if (isSubmitted) {
                if (isCorrect) {
                   containerStyles = "border-2 border-green-500 bg-green-500/10";
                   textStyles = "text-foreground font-bold";
                   icon = <CheckCircle2 className="ml-auto h-6 w-6 text-green-500 flex-shrink-0" />;
                } else if (isSelected && !isCorrect) {
                   containerStyles = "border-2 border-destructive bg-destructive/10";
                   textStyles = "text-foreground font-medium";
                   icon = <XCircle className="ml-auto h-6 w-6 text-destructive flex-shrink-0" />;
                } else {
                   containerStyles = "border-2 opacity-40 border-transparent bg-secondary/30 grayscale";
                }
              } else if (isSelected) {
                 containerStyles = "border-2 border-primary bg-primary/10 shadow-sm";
                 textStyles = "text-foreground font-medium";
              }

              return (
                <div
                  key={index}
                  onClick={() => !isSubmitted && handleAnswerToggle(index)}
                  className={cn(
                    "group relative flex items-center p-5 cursor-pointer transition-all duration-200 rounded-2xl backdrop-blur-[2px]",
                    containerStyles,
                    isSubmitted && "cursor-default"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => !isSubmitted && handleAnswerToggle(index)}
                    className={cn(
                      "mr-5 h-5 w-5 border-2 transition-all duration-200",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                      isSubmitted && "pointer-events-none" 
                    )}
                  />
                  <span className={cn(
                    "text-lg md:text-2xl transition-colors flex-1 leading-snug",
                    textStyles
                  )}>
                    {answer.text}
                  </span>
                  {icon}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
             <Button
              onClick={isSubmitted ? handleNext : handleSubmit}
              disabled={!isSubmitted && selectedAnswers.length === 0}
              size="lg"
              className={cn(
                "w-full md:w-auto min-w-[200px] h-16 text-lg rounded-2xl transition-all duration-300 shadow-xl",
                isSubmitted 
                  ? "bg-primary text-primary-foreground font-bold hover:scale-105 hover:shadow-2xl" 
                  : "bg-primary text-primary-foreground font-semibold tracking-wide", // Explicit solid default
                (!isSubmitted && selectedAnswers.length === 0) 
                  ? "bg-muted text-muted-foreground opacity-100 cursor-not-allowed shadow-none" // Solid disabled state, no opacity fade
                  : "hover:-translate-y-1 hover:shadow-primary/25"
              )}
            >
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
    </div>
  );
}