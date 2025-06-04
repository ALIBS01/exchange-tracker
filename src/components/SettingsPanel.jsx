import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";

const SettingsPanel = () => {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("Light");

  return (
    <div className="bg-gray-100 p-4 rounded-xl w-72 shadow-md space-y-4 text-sm">

      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Language</span>
        <button className="text-blue-600 font-medium">{language} &gt;</button>
      </div>


      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Currency</span>
        <button className="flex items-center gap-1 text-blue-600 font-medium">
          <FaDollarSign className="text-green-500" />
          {currency} &gt;
        </button>
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
