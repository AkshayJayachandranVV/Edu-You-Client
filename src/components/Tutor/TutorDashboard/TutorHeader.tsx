import { FaStar, FaUserGraduate, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import tutorAxios from "../../constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../constraints/endpoints/TutorEndpoints";
import { useEffect, useState } from "react";

function TutorHeader() {
  const { name } = useSelector((state: RootState) => state.tutor);
  const tutorId = useSelector((state: RootState) => state.tutor.id);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const ProfilePicture = useSelector((state: RootState) => state.tutor.profilePicture);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [courseResponse, studentResponse] = await Promise.all([
          tutorAxios.get<number>(`${tutorEndpoints.getTotalCoursesCount}/${tutorId}`),
          tutorAxios.get<number>(`${tutorEndpoints.getTotalStudentsCount}/${tutorId}`),
        ]);
        setTotalStudents(studentResponse.data);
        setTotalCourses(courseResponse.data);
      } catch (error) {
        console.log("Error in fetching header data", error);
      }
    };   
    fetchHeaderData();
  }, [tutorId]);

  const navigate = useNavigate();
  const handleAddCourse = () => {
    navigate('/tutor/addcourse');
  };

  return (
    <div className="flex flex-wrap bg-gray-900 text-white shadow-lg justify-center items-center md:justify-normal md:items-normal p-4">
      {/* Profile Image */}
      <div className="flex-shrink-0 ml-4 pl-4 flex justify-center">
        <img
          className="w-[180px] h-[180px] rounded-full border-4 border-gray-700 object-cover"
          src={ProfilePicture || tutorImage}
          alt="Tutor"
        />
      </div>

      {/* Tutor Info */}
      <div className="flex-grow flex flex-col justify-between ml-4">
        <div className="hidden pl-2 sm:block font-bold text-3xl">{name}</div>
        <div className="flex flex-col sm:flex-row justify-evenly items-center m-4 space-y-4 sm:space-y-0">
          <ul className="flex space-x-12 text-lg">
            <li className="flex items-center hover:text-yellow-400 transition">
              <FaStar className="text-yellow-500 mr-2" /> 0/5
            </li>
            <li className="flex items-center hover:text-green-400 transition">
              <FaUserGraduate className="text-green-500 mr-2" /> {totalStudents} Enrolled Students
            </li>
            <li className="flex items-center hover:text-orange-400 transition">
              <FaBookOpen className="text-orange-500 mr-2" /> {totalCourses} Courses
            </li>
          </ul>
          <button
            onClick={handleAddCourse}
            className="disabled sm:rounded-lg p-2 sm:bg-green-600 bg-green-500 text-white transition duration-200 hover:bg-green-700"
          >
            Create Course
          </button>
          <button
            onClick={handleAddCourse}
            className="block sm:hidden rounded-lg p-2 bg-green-500 text-white transition duration-200 hover:bg-green-700"
          >
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorHeader;
