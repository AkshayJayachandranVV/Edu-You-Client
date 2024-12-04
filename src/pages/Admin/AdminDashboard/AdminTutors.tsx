import { useEffect, useState } from "react";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminUsers from "../../../components/Admin/Dashboard/Body/AdminTutors";
import { adminEndpoints } from "../../../../src/components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";
import Loader from "../../../components/Spinner/Spinner2/Spinner2";

const AdminUsersPage = () => {
  const [usersData, setUsersData] = useState<FormattedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  interface User {
    tutorname: string;
    email: string;
    phone?: string;
    isBlocked: boolean;
    profile_picture: string;
  }

  interface FormattedUser {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    profile_picture: string;
  }

  useEffect(() => {
    fetchUsersData();
  }, [currentPage]); // Depend on currentPage to re-fetch when page changes

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;

      // Fetch paginated data from the server
      const result = await axiosInstance.get(adminEndpoints.tutors, {
        params: { skip, limit: itemsPerPage },
      });

      console.log(result);

      // Ensure result.data.tutors and result.data.totalCount are correctly returned
      const formattedData: FormattedUser[] = result.data.tutors.map(
        (user: User, index: number) => ({
          sino: skip + index + 1, // Adjust SINO based on current page
          image: user.profile_picture,
          name: user.tutorname,
          email: user.email,
          phone: user.phone || "Not Available",
          isBlocked: user.isBlocked,
        })
      );

      setUsersData(formattedData);
      setTotalItems(result.data.totalCount); // Total items for pagination
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
          <h3 className="text-center font-bold text-5xl mb-4 pl-24">Tutors List</h3>

          {loading ? (
            <Loader />
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              <div className="w-full flex justify-center">
                <div
                  className="w-full md:w-3/4 lg:w-2/3 overflow-x-auto mb-8"
                  style={{ marginLeft: "10%" }}
                >
                  {/* Responsive tutors data table */}
                  <AdminUsers tutorsData={usersData} />
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

export default AdminUsersPage;
