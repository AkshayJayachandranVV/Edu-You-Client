import React from 'react';
import TutorNavbar from '../../../components/Tutor/Dashboard/TutorDashboard/Navbar/Navbar';
import TutorSidebar from '../../../components/Tutor/Dashboard/TutorDashboard/Sidebar/Sidebar';

function TutorDashboard() {
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
          {/* Your main content goes here */}
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
