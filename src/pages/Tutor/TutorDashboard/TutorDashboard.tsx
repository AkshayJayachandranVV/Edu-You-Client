import React, { useState } from 'react';
import TutorNavbar from '../../../components/Tutor/Dashboard/TutorDashboard/Navbar/Navbar';
import TutorSidebar from '../../../components/Tutor/TutorSidebar';
import ProgressBar from '../../../components/Tutor/TutorProgressBar';

function TutorDashboard() {
  const [currentStep, setCurrentStep] = useState(2); // Example current step

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-[#1b2532] text-white p-4">
        <TutorSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-end">
          <TutorNavbar />
        </div>

        
        {/* Main Content */}
        <div className="flex-1 p-6 bg-white">
        <div style={{ maxWidth: '80%', margin: '0 auto',marginTop:'20px' }}>
          <ProgressBar currentStep={currentStep} totalSteps={4} />
        </div>
          <h1>Main content goes here</h1>
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
