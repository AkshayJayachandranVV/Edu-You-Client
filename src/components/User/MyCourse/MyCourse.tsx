import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import MycourseImage from '../../../assets/images/User/myCourses background.png';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

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
  const [reportDescription, setReportDescription] = useState(''); // New state for report description
  const navigate = useNavigate();
  const { id, username, email } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const endpoint = `${userEndpoints.myCourse.replace('userId', userId)}`;
          const allCourses = await axiosInstance.get(endpoint);
          
          if (allCourses.data.success) {
            const normalizedCourses = allCourses.data.courses.map((course:any) => ({
              ...course._doc,
              thumbnail: course.thumbnail,
            }));
            setCourses(normalizedCourses);
          } else {
            setCourses([]);
          }
        } catch (error) {
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
      <Navbar iconimage={iconimage} />
       
      <div className="relative bg-black p-6" style={{ minHeight: "150px" }}>
        <img
          src={MycourseImage}
          alt="Banner"
          className="w-[700px] h-[400px] object-cover mb-4"
          style={{ marginLeft: "700px", marginTop: "60px" }}
        />
        <div className="absolute" style={{ top: "40%", left: "210px", transform: "translateY(-50%)" }}>
          <h1 className="font-bold text-white" style={{ fontSize: "70px" }}>
            Online Education
          </h1>
          <p className="text-gray-300 mt-4 max-w-md" style={{ fontSize: "18px" }}>
            "Empowering minds from any place, at any time. Online education connects learners globally, offering knowledge and skills for a better future."
          </p>
          <button className="bg-teal-500 px-6 py-3 rounded text-lg font-bold mt-6">
            Try it Now
          </button>
        </div>
      </div>

      <div className="px-12 py-2 flex-grow">
        <h2 className="text-7xl font-bold mt-16 mb-10 text-center">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">No enrolled courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="bg-[#040509] p-6 rounded-lg shadow-md flex flex-col cursor-pointer relative"
              >
                <div
                  className="mb-4 h-40 bg-cover bg-center rounded"
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                ></div>
                <h3 className="text-xl font-semibold mb-2">{course.courseName}</h3>
                <p className="text-gray-400 mb-4">{course.lectures} Lectures</p>
                <button
                  className="mt-auto bg-teal-500 py-2 px-4 rounded font-bold"
                  onClick={() => CourseView(course._id)}
                >
                  Watch now
                </button>
                
                {/* Dropdown for Report option */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => openReportModal(course)}
                    className="text-gray-400 hover:text-teal-500 text-2xl" // Increased size
                  >
                    ⋮
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Reporting */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#181818] p-8 rounded-lg w-[800px]"> {/* Adjusted width here */}
            <h3 className="text-xl font-semibold mb-4 text-red-500">Report Course</h3>
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

            {/* Textarea for Report Description */}
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

      <div className="pb-16"></div>
      
      <Footer />
    </div>
  );
}
