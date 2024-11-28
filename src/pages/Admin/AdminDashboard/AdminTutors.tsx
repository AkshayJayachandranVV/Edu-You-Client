import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../../components/Admin/Dashboard/Navbar/Navbar";
import AdminSidebar from "../../../components/Admin/Dashboard/Sidebar/Sidebar";
import AdminUsers from "../../../components/Admin/Dashboard/Body/AdminTutors";
import { adminEndpoints } from "../../../../src/components/constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../components/constraints/axios/adminAxios";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";

const AdminUsersPage = () => {
  const navigate = useNavigate();
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
    profile_picture:string;
  }

  interface FormattedUser {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    profile_picture:string;
  }

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchUsersData();
    }
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;

      // Fetch paginated data
      const result = await axiosInstance.get(adminEndpoints.tutors, {
        params: { skip, limit: itemsPerPage },
      });

      console.log(result)

      const formattedData: FormattedUser[] = result.data.tutors.map(
        (user: User, index: number) => ({
          sino: skip + index + 1,
          image: user.profile_picture,
          name: user.tutorname,
          email: user.email,
          phone: user.phone || "Not Available",
          isBlocked: user.isBlocked,
        })
      );

      setUsersData(formattedData);
      setTotalItems(result.data.totalCount); // Total users count for pagination
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <AdminNavbar />
        <div className="flex-1 p-4 bg-black">
          <h3 className="text-center font-bold text-5xl mb-4 pl-24">Tutors List</h3>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center">{error}</p>
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
