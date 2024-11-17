import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminStudents from "../../../components/Admin/Dashboard/Body/AdminStudents";
import { adminEndpoints } from "../../../../src/components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";

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
  }

  interface FormattedStudent {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
  }

  useEffect(() => {
    fetchStudentsData();
  }, [currentPage]); // Re-fetch data whenever the currentPage changes

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;
  
      // Fetch paginated data from the server
      const result = await axiosInstance.get(adminEndpoints.students, {
        params: { skip, limit: itemsPerPage },
      });
  
      // Format data and calculate SINO based on skip value
      const formattedData: FormattedStudent[] = result.data.users.map(
        (student: Student, index: number) => ({
          sino: skip + index + 1, // Adjust SINO based on current page
          image: "default.png", // Assuming a default image for students
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
          <div
            className="flex-grow flex flex-col justify-start"
            style={{
              marginBottom: "19px",
              width: "75%",
              marginLeft: "auto",
              alignSelf: "flex-end",
              paddingRight: "135px",
            }}
          >
            {loading ? (
              <p style={{ color: "#FFFFFF" }}>Loading...</p>
            ) : error ? (
              <p style={{ color: "#FFFFFF" }}>{error}</p>
            ) : (
              <>
                <AdminStudents studentsData={studentsData} />
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

export default AdminStudentPage;
