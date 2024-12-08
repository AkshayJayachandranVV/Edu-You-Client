import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 
import MyCourseBanner from './MyCourseBanner';
import MycourseImage from '../../../assets/images/User/myCourses background.png';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import Skeleton from "@mui/joy/Skeleton";


interface Course {
  _id: string;
  thumbnail: string;
  courseName: string;
  lectures: number;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id, username, email } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const endpoint = `${userEndpoints.myCourse.replace('userId', userId)}`;
          const allCourses = await axiosInstance.get(endpoint);
          
          if (allCourses.data.success) {
            const normalizedCourses = allCourses.data.courses.map((course:any) => ({
              ...course,
              thumbnail: course.thumbnail,
            }));
            setCourses(normalizedCourses);
            setLoading(false);
          } else {
            setLoading(false);
            setCourses([]);
          }
        } catch (error) {
          setLoading(false);
          console.error("Error fetching courses:", error);
        }
      }
    };

    fetchCourseDetails();
  }, []);

  const CourseView = (courseId: string) => {
    navigate(`/courseView/${courseId}`);
  };

  const openReportModal = (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleReportSubmit = async () => {
    console.log(`Reporting course: ${selectedCourse?._id} for reason: ${reportReason}, description: ${reportDescription}`);
    
    const data = {
      courseId: selectedCourse?._id,
      userId: id,
      username: username,
      email: email,
      reason: reportReason,
      description: reportDescription,
    };
  
    try {
      const response = await axiosInstance.post(userEndpoints.report, data);
  
      if (response.data.success) {
        toast.success('Course reported successfully');
      } else {
        toast.error('Course report failed');
      }
    } catch (error) {
      console.error('Error reporting course:', error);
      toast.error('An error occurred while reporting the course. Please try again.');
    }
  
    setModalOpen(false);
    setReportReason('');
    setReportDescription('');
  };
  

  return (
    <div className="my-courses bg-[#111827] text-white min-h-screen flex flex-col">
  <Navbar />
  <MyCourseBanner MyCourseImg={MycourseImage} />

  <div className="px-4 sm:px-6 lg:px-12 py-2 flex-grow">
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-12 mb-8 text-center">
      My Courses
    </h2>

    {loading ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#1E293B] rounded-lg overflow-hidden shadow-lg border border-[#2D3748]"
                  >
                    {/* Skeleton for Thumbnail */}
                    <div className="relative h-48 md:h-64">
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px 8px 0 0",
                        }}
                      />
                    </div>

                    {/* Skeleton for Course Details */}
                    <div className="p-6">
                      <Skeleton
                        variant="text"
                        sx={{
                          width: "70%",
                          height: "24px",
                          marginBottom: "8px",
                        }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{
                          width: "100%",
                          height: "16px",
                          marginBottom: "4px",
                        }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{
                          width: "100%",
                          height: "16px",
                          marginBottom: "16px",
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <Skeleton
                          variant="text"
                          sx={{ width: "40%", height: "24px" }}
                        />
                        <div className="flex gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, starIndex) => (
                              <Skeleton
                                key={starIndex}
                                variant="circular"
                                sx={{ width: "16px", height: "16px" }}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length === 0 ? (
        <p className="text-center text-gray-400 text-lg sm:text-xl">
          No enrolled courses found.
        </p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="bg-[#040509] p-4 sm:p-6 rounded-lg shadow-md flex flex-col cursor-pointer relative"
          >
            <div
              className="mb-4 h-32 sm:h-40 lg:h-48 bg-cover bg-center rounded"
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            ></div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{course.courseName}</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">{course.lectures} Lectures</p>
            <button
              className="mt-auto bg-teal-500 py-2 px-4 rounded font-bold text-sm sm:text-base"
              onClick={() => CourseView(course._id)}
            >
              Watch now
            </button>

            {/* Dropdown for Report option */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => openReportModal(course)}
                className="text-gray-400 hover:text-teal-500 text-xl sm:text-2xl"
              >
                ⋮
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    </>)}
  </div>


  {/* Modal for Reporting */}
  {modalOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#181818] p-6 sm:p-8 rounded-lg w-[90%] sm:w-[600px] lg:w-[800px]">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-red-500">
          Report Course
        </h3>
        <p className="text-white">Select a reason for reporting:</p>
        <select
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mb-4 w-full bg-gray-800 text-white"
        >
          <option value="">Select a reason</option>
          <option value="Inappropriate content">Inappropriate content</option>
          <option value="Spam">Spam</option>
          <option value="Misleading information">Misleading information</option>
          <option value="Other">Other</option>
        </select>

        <p className="text-white">Additional details:</p>
        <textarea
          value={reportDescription}
          onChange={(e) => setReportDescription(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mb-4 w-full bg-gray-800 text-white"
          placeholder="Provide more details about the issue"
        ></textarea>

        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleReportSubmit}
            className="bg-red-500 px-4 py-2 rounded text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )}

  <Footer />
</div>

  );
}
