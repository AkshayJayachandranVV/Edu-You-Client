import React, { useState } from 'react';
import TutorNavbar from '../../../components/Tutor/TutorNavbar';
import TutorSidebar from '../../../components/Tutor/TutorSidebar';
import AddCourse from '../../../components/Tutor/TutorAddCourse';
import AddCourse2 from '../../../components/Tutor/TutorAddCourse2';
import AddCourse3 from '../../../components/Tutor/TutorAddCourse3';
import AddCourse4 from '../../../components/Tutor/TutorCourseSummary';
import ProgressBar from '../../../components/Tutor/TutorProgressBar'; // Import the ProgressBar

const Course = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0c11]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1b2532] text-white p-4">
        <TutorSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 text-white p-10 flex items-center justify-end" style={{ maxWidth: '80%', margin: '0 auto' }}>
          <TutorNavbar />
        </div>
        
        {/* Main Content */}
        <div style={{ backgroundColor: '#000000' }}>
          <div style={{ maxWidth: '80%', margin: '0 auto', marginBottom: '20px', backgroundColor: '#000000' }}>
            <ProgressBar currentStep={step} totalSteps={4} /> {/* Progress Bar */}
          </div>
          <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#000000' }}>
            <div className="flex-grow flex flex-col justify-start" style={{ marginTop: '10px' }}>
              {/* Step Components */}
              {step === 1 && <AddCourse onNext={handleNext} />}
              {step === 2 && <AddCourse2 onNext={handleNext} onBack={handleBack} />}
              {step === 3 && <AddCourse3 onNext={handleNext} onBack={handleBack} />}
              {step === 4 && <AddCourse4 onBack={handleBack} />} {/* Pass onBack to TutorCourseSummary */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
