import React from 'react';
import TutorNavbar from '../../../components/Tutor/TutorNavbar';
import TutorSidebar from '../../../components/Tutor/TutorSidebar';
import AddCourse from '../../../components/Tutor/TutorAddCourse2'; // Adjust the import path as needed

function TutorDashboard() {
  return (
    <div className="flex h-screen bg-[#0a0c11]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1b2532] text-white p-4">
        <TutorSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 text-white p-10 flex items-center justify-end">
          <TutorNavbar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#0a0c11' }}>
      <div className="flex-grow flex flex-col justify-start" style={{ marginTop: '-49px' }}>
        <AddCourse />
      </div>
    </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
