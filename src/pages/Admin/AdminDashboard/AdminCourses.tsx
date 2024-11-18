import { useEffect, useState } from "react";
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
        params: { skip: page, limit: itemsPerPage },
      });

      console.log(result.data);

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
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <AdminNavbar />
        <div className="flex-1 p-4 bg-black text-white">
          <h3 className="text-center font-bold text-2xl mb-4">Courses List</h3>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center">{error}</p>
          ) : (
            <>
              <div className="w-full overflow-x-auto mb-8">
                {/* Ensure the table is responsive and horizontally scrollable */}
                <div className="overflow-x-auto">
                  <AdminCoursesTable
                    data={{
                      initialCoursesData: coursesData,
                      currentPage,
                      itemsPerPage,
                    }}
                  />
                </div>
              </div>

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
  );
};

export default AdminCourses;
