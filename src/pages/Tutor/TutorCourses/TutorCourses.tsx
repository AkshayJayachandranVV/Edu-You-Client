import  { useEffect, useState } from "react";
import TutorNavbar from "../../../components/Tutor/TutorNavbar";
import TutorSidebar from "../../../components/Tutor/TutorSidebar";
import TutorCourses from "../../../components/Tutor/TutorCourses";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";

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

const Course = () => {
  // State to hold course data
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5; // Items per page

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const tutorId = localStorage.getItem("tutorId");
      if (!tutorId) {
        console.error("Tutor ID not found in localStorage.");
        return;
      }

      try {
        setLoading(true);

        // Calculate skip and fetch paginated data
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await axiosInstance.get(
        tutorEndpoints.listCourse,
          {
            params: { skip, limit: itemsPerPage,tutorId},
          }
        );

        if (response.data.success) {
          setCourseData(response.data.courses); // Update course data
          setTotalItems(response.data.totalCount); // Update total items count for pagination
        } else {
          setError("Failed to fetch courses.");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
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
              {/* Content */}
              {loading ? (
                <p style={{ color: "#FFFFFF" }}>Loading...</p>
              ) : error ? (
                <p style={{ color: "#FFFFFF" }}>{error}</p>
              ) : (
                <>
                  <TutorCourses 
                    courseData={courseData} 
                    startingIndex={(currentPage - 1) * itemsPerPage + 1}  />
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
