import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminPayouts from "../../../components/Admin/Dashboard/Body/AdminPayouts";
import { adminEndpoints } from "../../../../src/components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";

// Define the CourseData interface
interface CourseData {
  _id: string;
  adminShare: number;
  category: string;
  createdAt: string;
  discountPrice: number;
  thumbnail: string;
  title: string;
  tutorId: string;
  tutorName: string;
  tutorShare: number;
  userId: string;
  userName: string;
}

const AdminPayoutPage: React.FC = () => {
  const [coursesData, setCoursesData] = useState<CourseData[]>([]); // State with CourseData type
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    fetchCourseData(); // Fetch course data on component mount
  }, []);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      // Fetch data from the API
      const result = await axiosInstance.get(adminEndpoints.payouts);

      console.log(result, "Fetched data from payouts endpoint");

      // Set the fetched data to state
      setCoursesData(result.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data"); // Handle error
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#000000" }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AdminNavbar />
        <div
          className="flex-1 flex flex-col p-6"
          style={{ backgroundColor: "#000000", flexGrow: 1 }}
        >
          <h3
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "4rem",
              marginBottom: "10px",
              textAlign: "center",
              width: "100%",
              marginLeft: '80px'
            }}
          >
            Courses Payouts
          </h3>

          <div
            className="flex-grow flex flex-col justify-start"
            style={{
              marginBottom: "250vh",
              marginLeft: "12vw",
              alignSelf: "flex-end",
            }}
          >
            {loading ? (
              <p style={{ color: "#FFFFFF" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "#FFFFFF" }}>{error}</p>
            ) : (
              <AdminPayouts initialCoursesData={coursesData} /> // Pass the coursesData to AdminPayouts component
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayoutPage;
