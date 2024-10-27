import React, { useState } from 'react';
import TutorNavbar from '../../../components/Tutor/TutorNavbar';
import TutorSidebar from '../../../components/Tutor/TutorSidebar';
import BarGraph from '../../../components/Tutor/TutorDashboard/TutorBargraph';
import PieGraph from '../../../components/Tutor/TutorDashboard/TutorPiegraph';
import TutorHeader from '../../../components/Tutor/TutorDashboard/TutorCards';

const stats = [
  { title: 'Total Earnings', value: '$5,000', bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { title: 'Total Courses', value: '15', bgColor: 'bg-gradient-to-r from-green-400 to-blue-500' },
  { title: 'Total Enrolled Students', value: '200', bgColor: 'bg-gradient-to-r from-yellow-400 to-red-500' },
];

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
        <div className="bg-gray-800 text-white p-4 mb-4"> {/* Added margin-bottom */}
          <TutorNavbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
          <div className="flex flex-wrap justify-between mt-10 mb-4"> {/* Added margin-bottom */}
            {stats.map((stat, index) => (
              <TutorHeader key={index} title={stat.title} value={stat.value} bgColor={stat.bgColor} />
            ))}
          </div>
          
          {/* Graphs Section */}
          <div className="flex flex-col md:flex-row justify-between mt-10 space-y-4 md:space-y-0">
            <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md">
              <BarGraph />
            </div>
            <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md">
              <PieGraph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
