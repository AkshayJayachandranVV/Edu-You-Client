import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminCoursesTable from "../../../components/Admin/Dashboard/Body/AdminCourses"; // Assuming this is the table component
import { adminEndpoints } from "../../../components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalItems, setTotalItems] = useState(0); // Total items from backend
  const itemsPerPage = 5; // Items per page

  useEffect(() => {
    fetchCoursesData(currentPage); // Fetch data when page changes
  }, [currentPage]);

  const fetchCoursesData = async (page: number) => {
    try {
      setLoading(true);

      // Fetch paginated data from the API
      const result = await axiosInstance.get(adminEndpoints.courses, {
        params: { skip:page, limit: itemsPerPage },
      });

      console.log(result.data)

      setCoursesData(result.data.courses);
      setTotalItems(result.data.totalCount);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses data");
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // Update current page
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
                fontWeight: "bold",
                fontSize: "4rem",
                marginBottom: "20px",
                marginLeft: "250px",
                width: "100%",
                textAlign: "left",
              }}
            >
              Courses List
            </h3>

            {loading ? (
              <p style={{ color: "#FFFFFF" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "#FFFFFF" }}>{error}</p>
            ) : (
              <>
                <AdminCoursesTable data={{ initialCoursesData: coursesData, currentPage, itemsPerPage }} />
                <BasicPagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
