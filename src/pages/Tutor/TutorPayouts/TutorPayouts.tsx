import React, { useEffect, useState } from "react";
import TutorNavbar from "../../../components/Tutor/TutorNavbar";
import TutorSidebar from "../../../components/Tutor/TutorSidebar";
import TutorPayouts from "../../../components/Tutor/TutorPayouts";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";

interface Order {
  _id: string;
  title: string;
  thumbnail: string;
  category: string;
  coursePrice: number;
  tutorShare: number;
  discountPrice: number;
  createdAt: string;
  isListed?: boolean;
}

const Course = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5; // Define items per page

  // Fetch payouts data
  useEffect(() => {
    const fetchPayouts = async () => {
      const tutorId = localStorage.getItem("tutorId");
      if (!tutorId) {
        console.error("Tutor ID not found in localStorage.");
        return;
      }

      try {
        setLoading(true);
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await axiosInstance.get(tutorEndpoints.payouts, {
          params: { skip, limit: itemsPerPage, tutorId },
        });


        console.log(response)

        if (response.data.success) {
          setOrderData(response.data.orders); // Update order data
          setTotalItems(response.data.totalCount); // Update total items count for pagination
        } else {
          setError("Failed to fetch payouts.");
        }
      } catch (err) {
        console.error("Error fetching payouts:", err);
        setError("An error occurred while fetching payouts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-[#0a0c11]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1b2532] text-white p-4">
        <TutorSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div
          className="bg-gray-800 text-white p-10 flex items-center justify-end"
          style={{ maxWidth: "80%", margin: "0 auto" }}
        >
          <TutorNavbar />
        </div>

        {/* Main Content */}
        <div style={{ backgroundColor: "#000000" }}>
          <div
            className="flex-1 flex flex-col p-6"
            style={{ backgroundColor: "#000000" }}
          >
            <div
              className="flex-grow flex flex-col justify-start"
              style={{ marginTop: "10px" }}
            >
              {loading ? (
                <p style={{ color: "#FFFFFF" }}>Loading...</p>
              ) : error ? (
                <p style={{ color: "#FFFFFF" }}>{error}</p>
              ) : (
                <>
                  <TutorPayouts
                    payoutsData={orderData}
                    startingIndex={(currentPage - 1) * itemsPerPage + 1}
                  />
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
    </div>
  );
};

export default Course;
