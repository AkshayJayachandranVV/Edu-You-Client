import { useEffect, useState } from "react";
import TutorNavbar from "../../../components/Tutor/TutorNavbar";
import TutorSidebar from "../../../components/Tutor/TutorSidebar";
import TutorStudents from "../../../components/Tutor/TutorStudents";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import BasicPagination from "../../../components/Admin/Pagination/Pagination";
import Loader from "../../../components/Spinner/Spinner2/Spinner2";



interface Course {
  _id: string;
  courseName: string;
  thumbnail: string;
  courseCategory: string;
  courseLevel: string;
  courseDiscountPrice: number;
  createdAt: string;
}

const Students = () => {
  const [courseData, setCourseData] = useState<Course[]>([]);  // New state for courseData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8; 

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const tutorId = localStorage.getItem("tutorId");
      if (!tutorId) {
        console.error("Tutor ID not found in localStorage.");
        return;
      }
  
      try {
        setLoading(true);
  
        const skip = (currentPage - 1) * itemsPerPage;
        const response = await axiosInstance.get(tutorEndpoints.myCourses, {
          params: { skip, limit: itemsPerPage, tutorId },
        });
  
        if (response.data.success && response.data.courses.length > 0) {
          // Store the student data
          setTotalItems(response.data.totalCount);
  
          // Map studentsData to courseData
          const mappedCourseData = response.data.courses.map((course: any) => ({
            _id: course._id,
            courseName: course.name,
            thumbnail: course.thumbnail,
            courseCategory: course.courseCategory,
            courseLevel: course.courseLevel,
            courseDiscountPrice: course.courseDiscountPrice,
            createdAt: course.createdAt,
          }));
  
          setCourseData(mappedCourseData);
        } else {
          // Handle empty data
          setCourseData([]); // Ensure the table shows "No courses available"
          setTotalItems(0);  // Reset pagination to zero items
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudentDetails();
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
                <Loader />
              ) : error ? (
                <Loader />
              ) : (
                <>
                  <TutorStudents 
                    courseData={courseData}  
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

export default Students;
