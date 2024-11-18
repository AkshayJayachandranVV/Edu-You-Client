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
  tutorShare: number;  // Ensure this is 'number'
  userId: string;
  courseId: string;
  userName: string;
  courseName: string;
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
  });

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
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <AdminNavbar />
        <div className="flex-1 p-6 bg-black text-white">
          <h3 className="text-center font-bold text-4xl mb-4 pl-4">
            Courses Payouts
          </h3>

          <div className="flex-grow flex flex-col justify-start pl-6 pr-6">
            {loading ? (
              <p className="text-center text-white">Loading...</p>
            ) : error ? (
              <p className="text-center text-white">{error}</p>
            ) : (
              <>
                {/* Make the table responsive by adding scroll, aligned to the left */}
                <div className="overflow-x-auto w-full mb-8 lg:pl-40 lg:pr-6">
                  <AdminPayouts
                    data={{
                      initialCoursesData:coursesData ,
                      currentPage,
                      itemsPerPage,
                    }}
                  />
                </div>

                {/* Pagination */}
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
