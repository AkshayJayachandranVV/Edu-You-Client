import  { useEffect, useState } from "react";
import TutorNavbar from "../../../components/Tutor/TutorNavbar";
import TutorSidebar from "../../../components/Tutor/TutorSidebar";
import TutorPayouts from "../../../components/Tutor/TutorPayouts";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";
import Loader from "../../../components/Spinner/Spinner2/Spinner2";

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
  courseLvele:string
}

const Course = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5; // Define items per page

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
  
        console.log(response);
  
        if (response.data.success && response.data.orders.length > 0) {
          setOrderData(response.data.orders); 
          setTotalItems(response.data.totalCount); 
        } else {
          setOrderData([]); 
          setTotalItems(0);
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
                <Loader />
              ) : error ? (
                <p>Error is fetching data</p>
              ) : (
                <>
                  <TutorPayouts
                    payoutsData={orderData}
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
