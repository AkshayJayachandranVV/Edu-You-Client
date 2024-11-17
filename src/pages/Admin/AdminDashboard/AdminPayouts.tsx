import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminPayouts from "../../../components/Admin/Dashboard/Body/AdminPayouts";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";

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
  const [coursesData, setCoursesData] = useState<CourseData[]>([]); // Courses data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalItems, setTotalItems] = useState(0); // Total items from backend
  const itemsPerPage = 5; // Items per page

  useEffect(() => {
    fetchOrders(); // Fetch courses on component mount or page change
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      console.log("hyyyyy ");
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;

      // Fetch data from the API with skip and limit

      console.log(itemsPerPage, skip);
      const result = await axiosInstance.get(adminEndpoints.payouts, {
        params: { skip, limit: itemsPerPage },
      });

      console.log(result, "Fetched data from payouts endpoint");

      // Set the fetched data to state
      setCoursesData(result.data.orders); // Assuming API returns { courses, totalCount }
      setTotalItems(result.data.totalCount); // Set total items for pagination
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data"); // Handle error
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update current page
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
              marginLeft: "80px",
            }}
          >
            Courses Payouts
          </h3>

          <div
            className="flex-grow flex flex-col justify-start"
            style={{
              marginBottom: "10vh",
              marginLeft: "12vw",
              alignSelf: "flex-end",
            }}
          >
            {loading ? (
              <p style={{ color: "#FFFFFF" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "#FFFFFF" }}>{error}</p>
            ) : (
              <>
                {/* Render paginated data */}
                <AdminPayouts data={{ initialCoursesData: coursesData, currentPage, itemsPerPage }} />




                {/* Render pagination */}
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

export default AdminPayoutPage;
