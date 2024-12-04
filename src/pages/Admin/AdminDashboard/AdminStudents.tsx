import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminStudents from "../../../components/Admin/Dashboard/Body/AdminStudents";
import { adminEndpoints } from "../../../../src/components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";
import Loader from "../../../components/Spinner/Spinner2/Spinner2";

const AdminStudentPage = () => {
  const [studentsData, setStudentsData] = useState<FormattedStudent[]>([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalItems, setTotalItems] = useState(0); // Total items from backend
  const itemsPerPage = 5; // Items per page

  interface Student {
    username: string;
    email: string;
    phone?: string;
    isBlocked: boolean;
    profile_picture:string;
  }

  interface FormattedStudent {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    profile_picture:string;
  }

  useEffect(() => {
    fetchStudentsData();
  }, []); 
  

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;

      // Fetch paginated data from the server
      const result = await axiosInstance.get(adminEndpoints.students, {
        params: { skip, limit: itemsPerPage },
      });

      console.log(result)

      // Format data and calculate SINO based on skip value
      const formattedData: FormattedStudent[] = result.data.users.map(
        (student: Student, index: number) => ({
          sino: skip + index + 1, // Adjust SINO based on current page
          image: student.profile_picture, 
          name: student.username,
          email: student.email,
          phone: student.phone || "Not Available",
          isBlocked: student.isBlocked,
        })
      );

      // Update state with fetched and formatted data
      setStudentsData(formattedData);
      setTotalItems(result.data.totalUsers); // Total items for pagination
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page to trigger useEffect
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <AdminNavbar />
        <div className="flex-1 p-4 bg-black">
          <h3 className="text-center font-bold text-5xl mb-4 pl-24">Students List</h3>

          {loading ? (
            <Loader />
          ) : error ? (
            <Loader />
          ) : (
            <>
              <div className="w-full flex justify-center">
                <div
                  className="w-full md:w-3/4 lg:w-2/3 overflow-x-auto mb-8"
                  style={{ marginLeft: "10%" }}
                >
                  {/* Responsive student data table */}
                  <AdminStudents studentsData={studentsData} />
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

export default AdminStudentPage;
