import React, { useState } from "react";
import axiosInstance from "../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../components/constraints/endpoints/TutorEndpoints";
import  { AxiosError } from 'axios';


interface Student {
  _id: string;
  username: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Course {
  _id: string;
  courseName: string;
  thumbnail: string;
  courseCategory: string;
  courseLevel: string;
  courseDiscountPrice: number;
  createdAt: string;
}

const CourseComponent = ({ courseData,startingIndex}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [studentsData, setStudentsData] = useState<Student[]>([]); // State for students data
  const [noStudentsMessage, setNoStudentsMessage] = useState<string>(""); // State for no students message

  const handleCourseClick = async (courseId: string) => {
    console.log("Course Clicked:", courseId);

    try {
        // Fetch the students for the selected course
        const response = await axiosInstance.get(tutorEndpoints.courseStudents.replace('courseId', courseId));
        console.log("API Response:", response);

        // Check if the response indicates success
        if (response.data.success) {
            const foundCourse = courseData.find((course) => course._id === courseId);
            console.log("Selected Course:", foundCourse);

            if (foundCourse) {
                setSelectedCourse(foundCourse); // Set the selected course
                const students = response.data.students.students;

                if (students && students.length > 0) {
                    setStudentsData(students); // Use the actual students data from API response
                    setNoStudentsMessage(""); // Clear any previous no students message
                } else {
                    setStudentsData([]); // Clear students data if there are no students
                    setNoStudentsMessage("No students enrolled for this course."); // Set the no students message
                }
            } else {
                setSelectedCourse(null); // Handle case if course is not found
            }
        } else {
            // Handle case where the API indicates no students are enrolled
            console.error("Error: API response indicates no students.");
            const foundCourse = courseData.find((course) => course._id === courseId); // Get the course details
            if (foundCourse) {
                setSelectedCourse(foundCourse); // Set the selected course
                setStudentsData([]); // Clear students data
                setNoStudentsMessage("No students enrolled for this course."); // Set the no students message
            }
        }
    } catch (error) {
        // Handle errors as before
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            console.error("Error fetching course students:", axiosError.response.data);
            setNoStudentsMessage("An error occurred while fetching students."); // Generic error message
        } else {
            console.error("Error fetching course students:", error);
            setStudentsData([]); // Clear students data on error
            setNoStudentsMessage("An error occurred while fetching students."); // Set error message
        }
    }
};


  
  
  
  

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setStudentsData([]); // Clear students data when modal is closed
    setNoStudentsMessage(""); // Clear no students message
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h2 className="text-3xl text-center mb-6 text-yellow-400">Tutor Courses</h2>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-6">
          {courseData.map((course) => (
            <div
              key={course._id}
              className="bg-gradient-to-br from-[#1e1f22] to-[#374151] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex items-center"
              onClick={() => handleCourseClick(course._id)}
              style={{ width: '800px', height: '300px' }}
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                style={{ width: '300px', height: '260px' }}
                className="w-48 h-full object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{course.courseName}</h3>
                <p className="text-yellow-300">Category: {course.courseCategory}</p>
                <p className="text-yellow-300">Level: {course.courseLevel}</p>
                <p className="text-gray-200 mt-2">Discount Price: ${course.courseDiscountPrice}</p>
                <p className="text-gray-400 text-sm">Created on: {new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for course details with student list */}
      {selectedCourse && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#3b82f6] rounded-lg p-8 w-10/12 max-w-4xl shadow-2xl transition-transform transform scale-105">
            <h2 className="text-3xl mb-4 text-[#d1b055] font-semibold text-center">
                {selectedCourse.courseName}
            </h2>
            <h3 className="text-xl mb-4 text-[#d1b055] font-medium">Enrolled Students</h3>

            {noStudentsMessage && (
                <p className="text-red-500 text-center">{noStudentsMessage}</p>
            )}

            {studentsData.length > 0 ? (
                <div className="overflow-y-auto max-h-64">
                    <table className="min-w-full bg-[#202838] rounded-lg shadow-lg">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left text-[#d1b055] font-semibold border-b border-[#374151]">SI No.</th>
                                <th className="py-3 px-4 text-left text-[#d1b055] font-semibold border-b border-[#374151]">Username</th>
                                <th className="py-3 px-4 text-left text-[#d1b055] font-semibold border-b border-[#374151]">Email</th>
                                <th className="py-3 px-4 text-left text-[#d1b055] font-semibold border-b border-[#374151]">Phone</th>
                                <th className="py-3 px-4 text-left text-[#d1b055] font-semibold border-b border-[#374151]">Enrolled Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsData.map((student, index) => (
                                <tr key={student._id} className="hover:bg-[#2d3748] transition-colors duration-200">
                                    <td className="py-3 px-4 text-white border-b border-[#374151]">{index + 1}</td>
                                    <td className="py-3 px-4 text-white border-b border-[#374151]">{student.username}</td>
                                    <td className="py-3 px-4 text-white border-b border-[#374151]">{student.email}</td>
                                    <td className="py-3 px-4 text-white border-b border-[#374151]">{student.phone || 'N/A'}</td>
                                    <td className="py-3 px-4 text-white border-b border-[#374151]">{new Date(student.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                // This part is handled by the noStudentsMessage
                null
            )}

            <button
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCloseModal}
            >
                Close
            </button>
        </div>
    </div>
)}

    </div>
  );
};

export default CourseComponent;
