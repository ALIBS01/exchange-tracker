import { createContext, useContext, useState, useEffect } from "react";


const SettingsContext = createContext();


export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("Light");


  useEffect(() => {
    document.body.classList.remove("light", "dark");
    if (theme === "System") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.add(prefersDark ? "dark" : "light");
    } else {
      document.body.classList.add(theme.toLowerCase());
    }
  }, [theme]);

  return (
    <SettingsContext.Provider
      value={{ language, setLanguage, currency, setCurrency, theme, setTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = () => useContext(SettingsContext);
