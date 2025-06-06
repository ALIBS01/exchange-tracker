import { useSettings } from "../context/SettingsContext";
import { FaDollarSign } from "react-icons/fa";
import { useState } from "react";

const SettingsPanel = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    theme,
    setTheme,
  } = useSettings();

  const [showLangOptions, setShowLangOptions] = useState(false);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);

  const languages = ["English", "Turkish", "Spanish"];
  const currencies = ["USD", "EUR", "TRY"];

  return (
    <div className="bg-gray-100 p-4 rounded-xl w-72 shadow-md space-y-4 text-sm">

      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowLangOptions(!showLangOptions)}
        >
          <span className="text-gray-600 font-medium">Language</span>
          <span className="text-blue-600 font-medium">
            {language} &gt;
          </span>
        </div>
        {showLangOptions && (
          <ul className="mt-2 space-y-1">
            {languages.map((lang) => (
              <li
                key={lang}
                className={`cursor-pointer px-2 py-1 rounded ${
                  language === lang ? "bg-blue-200" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setLanguage(lang);
                  setShowLangOptions(false);
                }}
              >
                {lang}
              </li>
            ))}
          </ul>
        )}
      </div>


      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowCurrencyOptions(!showCurrencyOptions)}
        >
          <span className="text-gray-600 font-medium">Currency</span>
          <span className="flex items-center gap-1 text-blue-600 font-medium">
            <FaDollarSign className="text-green-500" />
            {currency} &gt;
          </span>
        </div>
        {showCurrencyOptions && (
          <ul className="mt-2 space-y-1">
            {currencies.map((curr) => (
              <li
                key={curr}
                className={`cursor-pointer px-2 py-1 rounded ${
                  currency === curr ? "bg-blue-200" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setCurrency(curr);
                  setShowCurrencyOptions(false);
                }}
              >
                {curr}
              </li>
            ))}
          </ul>
        )}
      </div>


      <div className="space-y-2">
        <span className="text-gray-600 font-medium">Theme</span>
        <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
          {["Light", "Dark", "System"].map((option) => (
            <button
              key={option}
              onClick={() => setTheme(option)}
              className={`flex-1 px-3 py-1 text-sm font-medium ${
                theme === option ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
