import React, { useEffect, useState } from "react";
import TutorNavbar from "../../../components/Tutor/TutorNavbar";
import TutorSidebar from "../../../components/Tutor/TutorSidebar";
import TutorPayouts from "../../../components/Tutor/TutorPayouts";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";



interface Order {
  _id: string;
  title: string;
  thumbnail: string;
  category: string;
  courseLevel: string;
  coursePrice: number;
  tutorShare:number;
  discountPrice: number;
  createdAt: string;
  isListed?: boolean;
}


const Course = () => {
  // State to hold course data
  const [orderData, setOrderData] = useState<Order[]>([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const tutorId = localStorage.getItem("tutorId");
      if (tutorId) {
        try {
          const orderDetails = await axiosInstance.get(`${tutorEndpoints.payouts.replace('tutorId', tutorId)}`);
          if (orderDetails.data.success) {
            console.log(orderDetails)
            setOrderData(orderDetails.data.orders); // Ensure courses is an array
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } else {
        console.error("Tutor ID not found in localStorage.");
      }
    };

    fetchCourseDetails();
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0c11]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1b2532] text-white p-4">
        <TutorSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div
          className="bg-gray-800 text-white p-10 flex items-center justify-end"
          style={{ maxWidth: "80%", margin: "0 auto" }}
        >
          <TutorNavbar />
        </div>

        {/* Main Content */}
        <div style={{ backgroundColor: "#000000" }}>
          <div
            className="flex-1 flex flex-col p-6"
            style={{ backgroundColor: "#000000" }}
          >
            <div
              className="flex-grow flex flex-col justify-start"
              style={{ marginTop: "10px" }}
            >
              {/* Step Components */}
              <TutorPayouts orderData={orderData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
