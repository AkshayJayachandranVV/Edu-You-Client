import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminCoursesTable from "../../../components/Admin/Dashboard/Body/AdminCourses"; // Assuming this is the table component
import { adminEndpoints } from "../../../components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";

// Define the Course interface
interface Course {
  _id: string;
  courseName: string;
  thumbnail: string;
  courseCategory: string;
  courseLevel: string;
  coursePrice: number;
  courseDiscountPrice: number;
  createdAt: string;
  isListed?: boolean;
}

const AdminCourses = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      // Fetch data from the API
      const result = await axiosInstance.get<Course[]>(adminEndpoints.courses);

      // Set the fetched data
      setCoursesData(result.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses data");
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#000000" }}
    >
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AdminNavbar />
        <div
          className="flex-1 flex flex-col p-6"
          style={{ backgroundColor: "#000000" }}
        >
          <div
            className="flex-grow flex flex-col justify-start"
            style={{
              marginBottom: "465px",
              width: "75%",
              marginLeft: "auto",
              paddingRight: "115px",
              alignSelf: "flex-end",
            }}
          >
            <h3
              style={{
                color: "#FFFFFF",
                fontWeight: "bold", // Use 'bold' for a stronger bold effect
                fontSize: "4rem", // Increase the font size for a larger header
                marginBottom: "20px",
                marginLeft: "250px", // Adjusted to make the header more centered
                width: "100%", // Set the width to 100% to make it occupy the full width of its container
                textAlign: "left", // Adjust text alignment if needed
              }}
            >
              Courses List
            </h3>

            {loading ? (
              <p style={{ color: "#FFFFFF" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "#FFFFFF" }}>{error}</p>
            ) : (
              // Pass the fetched courses data to the AdminCoursesTable component
              <AdminCoursesTable courseData={coursesData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
