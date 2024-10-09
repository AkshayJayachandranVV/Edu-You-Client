import React, { useState } from 'react';
import TutorNavbar from '../../../components/Tutor/TutorNavbar';
import TutorSidebar from '../../../components/Tutor/TutorSidebar';
import AddCourse from '../../../components/Tutor/TutorAddCourse/TutorAddCourse';
import AddCourse2 from '../../../components/Tutor/TutorAddCourse/TutorAddCourse2';
import AddCourse3 from '../../../components/Tutor/TutorAddCourse/TutorAddCourse3';
import AddCourse4 from '../../../components/Tutor/TutorAddCourse/TutorCourseSummary';
import ProgressBar from '../../../components/Tutor/TutorProgressBar'; // Import the ProgressBar


const Course = () => {
  const [step, setStep] = useState(1);

  // useEffect(() => {
  //   const fetchCourseDetails = async () => {
  //     try {
  //       // Ensure the courseId is present
  //       if (courseId) {
  //         const response = await axiosInstance.get(
  //           `${tutorEndpoints.fetchEditCourse.replace("courseId", courseId)}`
  //         );
  
  //         // Check if the response was successful
  //         if (response.data.success) {
  //           localStorage.setItem("editCourseId",response.data.courseId)
  //           const courseData = response.data.courses;

  //           // console.log(courseData,"course adat")
  
  //           // Dispatch course data to Redux
  //           dispatchCourseDataToRedux(courseData);
  //         } else {
  //           console.error("Failed to fetch course details:", response.data.message);
  //         }
  //       } else {
  //         console.error("Course ID is undefined");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching course details:", error);
  //     }
  //   };
  
  //   fetchCourseDetails();
  // }, [courseId]);
  
  // // Function to dispatch course data to Redux
  // const dispatchCourseDataToRedux = (courseData) => {
  //   // Dispatch the addCourse section
  //   dispatch(saveAddCourse({
  //     courseName: courseData.courseName,
  //     courseDescription: courseData.courseDescription,
  //     coursePrice: courseData.coursePrice,
  //     courseDiscountPrice: courseData.courseDiscountPrice,
  //     courseCategory: courseData.courseCategory,
  //     courseLevel: courseData.courseLevel,
  //     demoURL: courseData.demoURL,
  //     thumbnail: courseData.thumbnail,
  //     thumbnailUrl: courseData.thumbnailUrl || null,
  //   }));
  
  //   // Dispatch the addCourse2 section (prerequisites and benefits)
  //   dispatch(saveAddCourse2({
  //     prerequisites: courseData.prerequisites || [],
  //     benefits: courseData.benefits || [],
  //   }));
  
  //   // Dispatch lessons and sections
  //   courseData.sections.forEach((section, sectionIndex) => {
  //     section.lessons.forEach((lesson, lessonIndex) => {
  //       console.log(lesson, "eachhhhhhhhhhhhhhhhhhhhhhhhh lessson--------------");
    
  //       // Extract the necessary data from the lesson.$__parent.lessons array
  //       let lessonTitle = "";
  //       let videoUrl = "";
  //       let lessonDescription = "";
    
  //       if (lesson.$__parent && lesson.$__parent.lessons && lesson.$__parent.lessons.length > 0) {
  //         const parentLesson = lesson.$__parent.lessons[lessonIndex]; // Ensure you're accessing the correct lesson
  //         lessonTitle = parentLesson?.title || ""; // Fallback to empty string
  //         lessonDescription = parentLesson?.description || ""; // Fallback to empty string
  //         videoUrl = parentLesson?.video || ""; // Fallback to empty string
  //       } else {
  //         // Fallback to properties directly from the lesson object if $__parent is not available
  //         lessonTitle = lesson.title || "";
  //         lessonDescription = lesson.description || "";
  //         videoUrl = lesson.video || "";
  //       }
    
  //       // Dispatch the lesson data to Redux, ensuring videoUrl is a string
  //       dispatch(saveLessons({
  //         sectionIndex,
  //         lessonIndex,
  //         sectionTitle: section.title,
  //         lessonTitle: lessonTitle, // Ensure a string
  //         lessonDescription: lessonDescription, // Ensure a string
  //         videoUrl: videoUrl, // Ensure a string (no null or undefined)
  //         displayVideo: lesson.displayVideo || "", // Ensure a string
  //       }));
  //     });
  //   });
    
    
    
  // };
  

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
        <div className="bg-gray-800 text-white p-10 flex items-center justify-end" style={{ maxWidth: '80%', margin: '0 auto' }}>
          <TutorNavbar />
        </div>
        
        {/* Main Content */}
        <div style={{ backgroundColor: '#000000' }}>
          <div style={{ maxWidth: '80%', margin: '0 auto', marginBottom: '20px', backgroundColor: '#000000' }}>
            <ProgressBar currentStep={step} totalSteps={4} /> {/* Progress Bar */}
          </div>
          <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#000000' }}>
            <div className="flex-grow flex flex-col justify-start" style={{ marginTop: '10px' }}>
              {/* Step Components */}
              {step === 1 && <AddCourse onNext={handleNext} />}
              {step === 2 && <AddCourse2 onNext={handleNext} onBack={handleBack} />}
              {step === 3 && <AddCourse3 onNext={handleNext} onBack={handleBack} />}
              {step === 4 && <AddCourse4 onBack={handleBack} />} {/* Pass onBack to TutorCourseSummary */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
