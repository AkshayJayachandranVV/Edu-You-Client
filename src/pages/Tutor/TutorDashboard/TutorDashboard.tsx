import React, { useState, useEffect } from 'react';
import TutorNavbar from '../../../components/Tutor/TutorNavbar';
import TutorSidebar from '../../../components/Tutor/TutorSidebar';
import BarGraph from '../../../components/Tutor/TutorDashboard/TutorBargraph';
import PieGraph from '../../../components/Tutor/TutorDashboard/TutorPiegraph';
import TutorHeader from '../../../components/Tutor/TutorDashboard/TutorCards';
import axiosInstance from '../../../components/constraints/axios/tutorAxios';
import { tutorEndpoints } from '../../../components/constraints/endpoints/TutorEndpoints';

function TutorDashboard() {
  const [currentStep, setCurrentStep] = useState(2); // Example current step
  const [earningsData, setEarningsData] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  
  // State for graph data
  const [barGraphData, setBarGraphData] = useState([]);
  const [pieGraphData, setPieGraphData] = useState([]);

  useEffect(() => {
    fetchCardDetails();
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const tutorId = localStorage.getItem("tutorId");
      if (tutorId) {
        const graphdata = await axiosInstance.get(
          `${tutorEndpoints.graphData.replace("tutorId", tutorId)}`
        );
        console.log(graphdata, "----------------------data ");

        // Assuming graphdata contains the properties barGraph and pieGraph
        if (graphdata.data) {
          setBarGraphData(graphdata.data.barGraph || []);
          setPieGraphData(graphdata.data.pieGraph || []);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCardDetails = async () => {
    try {
      const tutorId = localStorage.getItem("tutorId");
      console.log("Fetching data for tutorId:", tutorId);
      if (tutorId) {
        const response = await axiosInstance.get(
          `${tutorEndpoints.cardsData.replace("tutorId", tutorId)}`
        );

        // Assuming response data structure matches your description
        if (response.data) {
          setEarningsData(response.data.earningsData || 0);
          setTotalCourses(response.data.cardsData?.totalCourses || 0);
          setTotalStudents(response.data.cardsData?.totalStudents || 0);
        }
      }
    } catch (error) {
      console.log("Error fetching card details:", error);
    }
  };

  const stats = [
    { title: 'Total Earnings', value: `$${earningsData.toFixed(2)}`, bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { title: 'Total Courses', value: totalCourses.toString(), bgColor: 'bg-gradient-to-r from-green-400 to-blue-500' },
    { title: 'Total Enrolled Students', value: totalStudents.toString(), bgColor: 'bg-gradient-to-r from-yellow-400 to-red-500' },
  ];

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
              <BarGraph data={barGraphData} /> {/* Pass bar graph data */}
            </div>
            <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md">
              <PieGraph data={pieGraphData} /> {/* Pass pie graph data */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
