import { QuizApp } from "@/components/QuizApp";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./index.css";

export function App() {
  return (
    <ThemeProvider>
      <QuizApp />
    </ThemeProvider>
  );
}

export default App;