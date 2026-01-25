import { useState, useEffect } from "react";

export function useThemeObserver() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();

    // Observe changes to the class attribute on the html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
