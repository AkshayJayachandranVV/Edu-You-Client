import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import AdminNavbar from '../../../components/Admin/Dashboard/Navbar/Navbar';
import AdminSidebar from '../../../components/Admin/Dashboard/Sidebar/Sidebar';
import AdminBarGraph from '../../../components/Admin/Graph/barGraph';
import AdminPieGraph from '../../../components/Admin/Graph/pieGraph';
import Cards from '../../../components/Admin/Graph/Cards';
import axiosInstance from '../../../components/constraints/axios/adminAxios';
import { adminEndpoints } from '../../../components/constraints/endpoints/adminEndpoints';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
        const graphdata = await axiosInstance.get(adminEndpoints.graphData);
        console.log(graphdata, "----------------------data ");

        // Assuming graphdata contains the properties barGraph and pieGraph
        if (graphdata.data) {
          setBarGraphData(graphdata.data.barGraph || []);
          setPieGraphData(graphdata.data.pieGraph || []);
        }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCardDetails = async () => {
    try {
        const response = await axiosInstance.get(adminEndpoints.cardsData);

        // Assuming response data structure matches your description
        console.log(response,"dat got")
        if (response.data) {
          setEarningsData(response.data.totalProfit || 0);
          setTotalCourses(response.data.totalCourses || 0);
          setTotalStudents(response.data.totalStudents|| 0);
        }
    } catch (error) {
      console.log("Error fetching card details:", error);
    }
  };



  const stats = [
    { title: 'Total Earnings', value:`₹${earningsData}` , bgColor: 'bg-gradient-to-r from-gray-800 to-black' },
    { title: 'Total Courses', value: totalCourses, bgColor: 'bg-gradient-to-r from-gray-800 to-black' },
    { title: 'Total Students', value: totalStudents, bgColor: 'bg-gradient-to-r from-gray-800 to-black' },
  ];
  
  
  
  
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-[#1b2532] text-white p-4">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 text-white p-4 mb-4">
          <AdminNavbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
        <div className="flex flex-wrap justify-between mt-10 mb-4"> {/* Added margin-bottom */}
            {stats.map((stat, index) => (
              <Cards key={index} title={stat.title} value={stat.value} bgColor={stat.bgColor} />
            ))}
          </div>

          {/* Graphs Section */}
          <div className="flex flex-col md:flex-row justify-between mt-10 space-y-4 md:space-y-0">
            <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md">
              <AdminBarGraph graphData={barGraphData}/>
            </div>
            <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md">
              <AdminPieGraph data={pieGraphData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
