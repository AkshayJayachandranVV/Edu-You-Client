import React, { useEffect, useState } from "react";
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
  }

  interface FormattedUser {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
  }

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchUsersData();
    }
  }, [currentPage, navigate]);

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
          image: "default.png",
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
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#000000" }}>
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
                <AdminUsers tutorsData={usersData} />
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

export default AdminUsersPage;
