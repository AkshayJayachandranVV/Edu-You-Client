import React, { useState, useEffect, useRef } from "react";
import LanguageSelector from "./SelectLanguage";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./constants";
import axios from "axios";

const OnlineCompiler = ({ onClose }: { onClose: () => void }) => {
  const [code, setCode] = useState(CODE_SNIPPETS.javascript);
  const [output, setOutput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof CODE_SNIPPETS>("javascript");
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const courseSectionRef = useRef<HTMLDivElement>(null);

  const handleRunCode = async () => {
    try {
      const API = axios.create({
        baseURL: "https://emkc.org/api/v2/piston",
      });

      console.log("Requesting execution:", {
        language: selectedLanguage,
        version: LANGUAGE_VERSIONS[selectedLanguage],
        files: [{ content: code }],
      });

      const response = await API.post("/execute", {
        language: selectedLanguage,
        version: LANGUAGE_VERSIONS[selectedLanguage],
        files: [{ content: code }],
      });

      console.log("Execution result:", response.data);

      const result = response.data?.run;

      // Display the execution output in the output section
      if (result?.stdout) {
        setOutput(result.stdout);
      } else if (result?.stderr) {
        setOutput(result.stderr); // Display any error messages
      } else {
        setOutput("No output returned.");
      }
    } catch (error: any) {
      console.error("Execution error:", error);
      setOutput(error.response?.data?.message || "An error occurred during execution.");
    }
  };

  const handleLanguageChange = (language: keyof typeof CODE_SNIPPETS) => {
    setSelectedLanguage(language); // Update the selected language
    setCode(CODE_SNIPPETS[language]); // Set the corresponding code snippet
  };

  useEffect(() => {
    if (courseSectionRef.current) {
      const courseSectionRect = courseSectionRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - 700 - 10,
        y: courseSectionRect.top - 25,
      });
    }
  }, []);

  // Prevent dragging for specific areas
  const preventDrag = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
  ref={courseSectionRef}
  className="fixed bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] shadow-2xl rounded-lg w-[700px] z-50 p-8 transform transition-all duration-300 ease-in-out"
  style={{ left: `${position.x}px`, top: `${position.y}px` }}
>
  {/* Close Button */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-white">Online Compiler</h2>
    <button
  className="bg-red-600 text-white text-lg font-semibold py-3 px-8 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition duration-300"
  onClick={onClose}
>
  ✕
</button>

  </div>

  {/* Language Selector */}
  <LanguageSelector
    selectedLanguage={selectedLanguage}
    onLanguageChange={handleLanguageChange}
  />

  {/* Code Editor */}
  <div className="flex flex-col h-80 space-y-4">
    <textarea
      className="no-drag flex-grow bg-[#000000] text-gray-200 rounded-lg p-4 mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
      placeholder={`Write your ${selectedLanguage} code here...`}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      onMouseDown={preventDrag} // Prevent dragging for textarea
    ></textarea>
    <button
      className="self-end bg-cyan-600 text-white py-2 px-6 rounded-lg hover:bg-cyan-500 transition duration-300"
      onClick={handleRunCode}
    >
      Run Code
    </button>
  </div>

  {/* Output Section */}
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-gray-200 mb-3">Output</h3>
    <div
      className="no-drag bg-[#000000] text-gray-300 rounded-lg p-4 border border-gray-600 overflow-auto h-32 shadow-inner"
      onMouseDown={preventDrag} // Prevent dragging for output
    >
      {output || "Output will appear here..."}
    </div>
  </div>
</div>

  );
};

export default OnlineCompiler;
