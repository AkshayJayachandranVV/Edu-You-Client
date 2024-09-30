import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate the progress percentage based on the current step
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Render checkpoints with tick icons
  const renderCheckpoints = () => {
    const checkpoints = [];
    for (let i = 1; i <= totalSteps; i++) {
      const position = ((i - 1) / (totalSteps - 1)) * 100; // Position each checkpoint evenly
      checkpoints.push(
        <div
          key={i}
          className={`absolute top-1/2 transform -translate-y-1/2 flex items-center justify-center ${
            i <= currentStep ? 'text-green-400' : 'text-gray-400'
          }`} // Completed steps are green, others are gray
          style={{ left: `${position}%`, width: '24px', height: '24px' }}
        >
          <FaCheckCircle size={24} />
        </div>
      );
    }
    return checkpoints;
  };

  return (
    <div className="relative w-full bg-gray-300 rounded-full h-4"> {/* Lighter background for contrast */}
      <div
        className="bg-green-400 h-full rounded-full"  // Progress bar color (green for contrast)
        style={{ width: `${progressPercentage}%` }}
      ></div>
      {renderCheckpoints()}
    </div>
  );
};

export default ProgressBar;
