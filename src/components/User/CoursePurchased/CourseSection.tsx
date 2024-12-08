import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import tutorImage from "../../../assets/images/User/UserHome/Account.png";
import CloseIcon from "@mui/icons-material/Close";
import VideoIcon from "@mui/icons-material/OndemandVideo";
import StarIcon from "@mui/icons-material/Star";

interface CourseProps {
  course?: {
    courseName: string;
    courseDescription: string;
    sections: {
      title: string;
      lessons: { title: string; displayVideo: string }[];
    }[];
    rating?: number;
  };
  tutor?: {
    _id: string;
    name: string;
    email: string;
    phone: number;
  };
  openSection?: number | null;
  toggleSection?: (section: number) => void;
  handleVideoClick?: (videoUrl: string) => void;
}

const CourseSections: React.FC<CourseProps> = ({
  course,
  openSection,
  toggleSection,
  handleVideoClick,
  tutor,
}) => {
  return (
    <div className="max-w-2xl w-full bg-[#1f2937] shadow-lg rounded-lg p-10 mt-15 text-gray-200 mx-auto">
      <h2 className="text-2xl font-bold mb-6">{course?.courseName}</h2>
      <p className="text-lg mb-8 text-gray-400">{course?.courseDescription}</p>

      <h3 className="text-2xl font-semibold mb-6">Sections</h3>
      {course?.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer p-6 bg-[#374151] rounded-md shadow-md hover:bg-[#4b5563] transition-colors"
            onClick={() => toggleSection?.(index)}
          >
            <div className="text-xl font-medium text-gray-300">
              {section.title}
            </div>
            {openSection === index ? (
              <CloseIcon className="text-gray-400" />
            ) : (
              <ArrowDropDownIcon className="text-gray-400" />
            )}
          </div>

          {openSection === index && section.lessons.length > 0 && (
  <div className="mt-4 bg-[#111827] p-6 rounded-lg shadow-md">
    {section.lessons.map((lesson, lessonIndex) => (
      <div
        key={lessonIndex}
        className="flex justify-between items-center mb-4 hover:bg-[#374151] p-2 rounded-lg transition duration-300" // Added hover effect
        onClick={() => handleVideoClick?.(lesson.displayVideo)}
      >
        <p className="text-lg font-bold text-gray-300 transition duration-300 hover:text-teal-400">{lesson.title}</p> {/* Made title bold with transition */}
        <div
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VideoIcon
            style={{ fontSize: "42px" }} // Custom icon size
            className="cursor-pointer text-teal-400 transition-transform transform hover:scale-110"
          />
        </div>
      </div>
    ))}
  </div>
)}

          {openSection === index && section.lessons.length === 0 && (
            <p className="mt-4 text-gray-500 text-lg">
              No lessons available in this section.
            </p>
          )}
        </div>
      ))}

      {tutor && (
        <div className="tutorDetails mt-12 p-6 bg-[#374151] rounded-lg shadow-md flex items-center space-x-6">
          <img
            src={tutorImage}
            alt="Tutor"
            className="w-24 h-24 rounded-full border-2 border-teal-400"
          />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-gray-200">{tutor.name}</p>
            <div className="rating flex items-center mt-2">
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                  key={index}
                  style={{
                    color:
                      index < (course?.rating || 0) ? "#fbbf24" : "#4b5563",
                  }}
                />
              ))}
              <p className="ml-3 text-lg text-gray-400">
                {course?.rating || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSections;
