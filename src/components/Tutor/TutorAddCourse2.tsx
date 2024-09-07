import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const AddCoursePage2: React.FC = () => {
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  const handlePrerequisiteChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index] = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = value;
    setBenefits(updatedBenefits);
  };

  const addPrerequisite = () => setPrerequisites([...prerequisites, ""]);
  const removePrerequisite = (index: number) => {
    const updatedPrerequisites = prerequisites.filter((_, i) => i !== index);
    setPrerequisites(updatedPrerequisites);
  };

  const addBenefit = () => setBenefits([...benefits, ""]);
  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#0a0c11' }}>
      <div className="w-[90%] max-w-4xl bg-[#1b2532] shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
          Add Course Details
        </h2>
        
        <div className="flex flex-col gap-8">
          {/* Prerequisites Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-gray-300">Prerequisites</h3>
            {prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                  className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a prerequisite..."
                />
                <button
                  type="button"
                  className="p-2 text-red-600 hover:text-red-800"
                  onClick={() => removePrerequisite(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 bg-[#5f71ea] text-white font-semibold rounded-md hover:bg-[#4e5eb4] transition"
              onClick={addPrerequisite}
            >
              <FaPlus className="mr-2" /> Add Prerequisite
            </button>
          </div>

          {/* Benefits Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-gray-300">Benefits</h3>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a benefit..."
                />
                <button
                  type="button"
                  className="p-2 text-red-600 hover:text-red-800"
                  onClick={() => removeBenefit(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 bg-[#5f71ea] text-white font-semibold rounded-md hover:bg-[#4e5eb4] transition"
              onClick={addBenefit}
            >
              <FaPlus className="mr-2" /> Add Benefit
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="w-full flex justify-between mt-6">
            <button
              type="button"
              className="py-2 px-8 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#0a0c11] transition"
            >
              Back
            </button>
            <button
              type="button"
              className="py-2 px-8 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#0a0c11] transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage2;
