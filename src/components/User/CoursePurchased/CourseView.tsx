// CourseDetails.tsx
import React from "react";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import TranslateIcon from "@mui/icons-material/Translate";
import { RiCheckDoubleLine } from "react-icons/ri";

const CourseDetails: React.FC = () => {
  // Placeholder values
  const courseTitle = "Course Title Placeholder";
  const courseDescription = "This is a placeholder description for the course.";
  const courseRating = "4.5 Rating";
  const courseEnrolled = "12,345 Enrolled";
  const courseLanguage = "English";
  const courseBenefits = [
    "Placeholder benefit 1",
    "Placeholder benefit 2",
    "Placeholder benefit 3",
  ];
  const coursePrerequisites = [
    "Placeholder prerequisite 1",
    "Placeholder prerequisite 2",
    "Placeholder prerequisite 3",
  ];

  const selectedVideo = null; // No video selected for the mockup

  return (
    <div className="max-w-5xl w-full bg-[#1f2937] shadow-xl rounded-lg p-6 text-gray-200"> {/* Increased max width to 4xl */}
      <h2 className="text-5xl font-bold text-teal-400">{courseTitle}</h2>
      <div className="flex items-center space-x-8 mt-4 text-gray-400">
        <div className="flex items-center space-x-2">
          <StarIcon className="text-amber-400" />
          <p>{courseRating}</p>
        </div>
        <div className="flex items-center space-x-2">
          <SchoolIcon className="text-violet-400" />
          <p>{courseEnrolled}</p>
        </div>
        <div className="flex items-center space-x-2">
          <TranslateIcon className="text-pink-400" />
          <p>{courseLanguage}</p>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full mt-6">
        {selectedVideo ? (
          <video className="w-full rounded-lg shadow-lg" controls src={selectedVideo}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-400">No video available</p>
        )}
      </div>

      {/* Course Description */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-teal-400 mb-2">Description</h3>
        <p className="text-gray-300">{courseDescription}</p>
      </div>

      {/* Benefits Section */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-teal-400 mb-2">Benefits</h3>
        <ul className="space-y-2">
          {courseBenefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <RiCheckDoubleLine className="text-teal-400 mr-2" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Prerequisites */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-teal-400 mb-2">Prerequisites</h3>
        <ul className="space-y-2">
          {coursePrerequisites.map((prerequisite, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <RiCheckDoubleLine className="text-teal-400 mr-2" />
              {prerequisite}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetails;
