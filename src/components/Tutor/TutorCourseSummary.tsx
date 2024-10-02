import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { clearCourseData } from '../../redux/courseSlice'; // Adjust the import as needed
import {courseEndpoints} from '../../../src/components/constraints/endpoints/courseEndpoints'
import axios from "axios";

interface Lesson {
  title: string;
  video: string | null; // URL for the video preview
  displayVideo:string | null; 
  description: string;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

const TutorCourseSummary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const dispatch = useDispatch(); // Use useDispatch to access dispatch
  const courseData = useSelector((state: RootState) => state.course);

  console.log(courseData, "0--=0009-------------------------------------");

  const {
    courseDetails: {
      courseName,
      courseDescription,
      coursePrice,
      courseDiscountPrice,
      courseCategory,
      courseLevel,
      demoURL,
      thumbnail,
      benefits,
      prerequisites,
    },
    sections,
  } = courseData;

  const typedSections: Section[] = sections || []; // Use empty array as a fallback


//   interface CourseData {
//     courseName: string;
//     courseDescription: string;
//     coursePrice: number;
//     courseDiscountPrice: number;
//     courseCategory: string;
//     courseLevel: string;
//     demoURL: string;
//     benefits: string[];
//     prerequisites: string[];
//     sections: Section[];
// }


// Handle form submission
// Handle form submission
const handleSubmit = async () => {
  try {
    // Prepare the data to submit
    const dataToSubmit = {
      courseName,
      courseDescription,
      coursePrice,
      courseDiscountPrice,
      courseCategory,
      courseLevel,
      demoURL,
      thumbnail,
      benefits,
      prerequisites,
      sections: typedSections.map(section => ({
        title: section.title,
        lessons: section.lessons.map(({ title, video, description }) => ({ title, video, description })) // Include title, video, and description
      }))
    };

    console.log(dataToSubmit, "the ------------------------------- last fonal 3666666666666666667w8829999");

    const result = await axios.post(courseEndpoints.uploadCourse, dataToSubmit);

    console.log("result got", result);

    // Dispatch the action to submit course data
    // dispatch(clearCourseData());

  } catch (error) {
    console.log(error);
  }
};






  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Course Summary</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-6">
        <h3 className="text-2xl font-bold mb-2 text-center">{courseName}</h3>
        <p className="text-gray-300 mb-2"><strong>Price:</strong> {coursePrice}</p>
        <p className="text-gray-300 mb-2"><strong>Discount Price:</strong> {courseDiscountPrice}</p>
        <p className="text-gray-300 mb-2"><strong>Description:</strong> {courseDescription}</p>
        <p className="text-gray-300 mb-2"><strong>Category:</strong> {courseCategory}</p>
        <p className="text-gray-300 mb-2"><strong>Level:</strong> {courseLevel}</p>
        <p className="text-gray-300 mb-2"><strong>Demo URL:</strong> <a href={demoURL} target="_blank" rel="noopener noreferrer" className="text-blue-400">{demoURL}</a></p>
        <p className="text-gray-300 mb-2"><strong>Benefits:</strong></p>
        <ul className="list-disc pl-5 mb-4 text-gray-300">
          {benefits?.map((benefit, index) => <li key={index}>{benefit}</li>)}
        </ul>
        <p className="text-gray-300 mb-2"><strong>Prerequisites:</strong></p>
        <ul className="list-disc pl-5 text-gray-300">
          {prerequisites?.map((prerequisite, index) => <li key={index}>{prerequisite}</li>)}
        </ul>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h3 className="text-2xl font-bold mb-4 text-center">Sections and Lessons</h3>
        {typedSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h4 className="text-xl font-semibold mb-3">{section.title}</h4>
            {section.lessons?.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="mb-4">
                <h5 className="text-lg font-medium mb-1">{lesson.title}</h5>
                <p className="text-gray-300 mb-2">{lesson.description}</p>
                {lesson.displayVideo && (
                  <video
                    src={lesson.displayVideo}
                    controls
                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TutorCourseSummary;
