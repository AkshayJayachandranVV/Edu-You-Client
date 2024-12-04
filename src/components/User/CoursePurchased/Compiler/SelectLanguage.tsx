import React from "react";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./constants";

type LanguageSelectorProps = {
  selectedLanguage: keyof typeof CODE_SNIPPETS;
  onLanguageChange: (language: keyof typeof CODE_SNIPPETS) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  //   const languages = ["JavaScript", "Python", "Java", "C++", "Ruby"];

  const languages = Object.entries(LANGUAGE_VERSIONS);
  const DefultCode = CODE_SNIPPETS[selectedLanguage];
  console.log(DefultCode);

  console.log(languages);

  return (
    <div className="flex items-center space-x-4 mb-4">
      <label htmlFor="language-selector" className="text-gray-200 font-medium">
        Language:
      </label>
      <select
        id="language-selector"
        className="bg-[#111827] text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={selectedLanguage}
        onChange={(e) =>
          onLanguageChange(e.target.value as keyof typeof CODE_SNIPPETS)
        }
      >
        {languages.map(([language, version]) => (
          <option key={language} value={language}>
            {`${language} (${version})`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
