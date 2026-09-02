import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const DarkModeContext = createContext();
function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, "isDarkMode");
  function toggleDarkMode() {
    setIsDarkMode((mode) => !mode);
  }

  // Reflect isDarkMode onto the root element so the CSS .dark-mode/.light-mode variables apply
  useEffect(
    function () {
      document.documentElement.classList.toggle("dark-mode", isDarkMode);
      document.documentElement.classList.toggle("light-mode", !isDarkMode);
    },
    [isDarkMode],
  );

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("DarkModeContext used outside of the provider");
  return context;
}

export { DarkModeProvider, useDarkMode };
