import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Home/UserHome/Navbar/Navbar";
import Footer from "../../Home/UserHome/Footer/Footer";
import { courseEndpoints } from "../../../constraints/endpoints/courseEndpoints";
import banner from "../../../../assets/images/User/UserHome/userHome.png";
import aboutUs from "../../../../assets/images/User/UserHome/aboutUs.webp";
import { tutorEndpoints } from "../../../constraints/endpoints/TutorEndpoints";
import Skeleton from "@mui/joy/Skeleton";
interface Course {
  _id: string;
  thumbnail: string;
  thumbnailUrl?: string;
  courseName: string;
  courseDescription: string;
  coursePrice: string;
  averageRating: number;
}

export default function UserHome() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCardClick = (courseId: string) => {
    // Call your function here
    console.log(`Course ID clicked: ${courseId}`);

    // Navigate to the course details page
    navigate(`/courseDetails/${courseId}`);
  };

  const allCourse = () => {
    navigate("/allCourses");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(courseEndpoints.userCourse);
      setCourses(result.data.courses); // Store fetched courses in state

      console.log(result.data.courses);

      // Generate signed URLs for each course's thumbnail
      const initialUrls = await result.data.courses.reduce(
        async (accPromise: any, course: Course) => {
          const acc = await accPromise; // Await the previous accumulator promise
          const data = {
            imageKey: course.thumbnail, // Use the original thumbnail key
          };

          console.log(data);
          setLoading(false);
          const response = await axios.post(tutorEndpoints.getSignedUrl, data); // Await the axios post
          console.log(response.data, "--------------------url");

          // Assign the signed URL to the course object
          acc.push({ ...course, thumbnailUrl: response.data }); // Store the signed URL in thumbnailUrl
          return acc;
        },
        Promise.resolve([])
      ); // Start with an empty array

      setCourses(initialUrls); // Set updated courses with thumbnailUrl
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Discover
                <br />
                the professions
                <br />
                of the future
              </h1>
              <p className="text-lg md:text-xl opacity-80">
                Learn from yesterday, live for today, and build for tomorrow
                with the power of education.
              </p>
              <button
                onClick={allCourse}
                className="bg-[#16ECCA] hover:bg-[#14b3b0] text-white px-8 py-3 rounded-md text-lg transition-colors duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 md:h-96 lg:h-[400px] rounded-lg overflow-hidden">
                <img
                  src={banner}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-8 md:py-12 mt-[-40px] md:mt-[-80px]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
            Featured Courses
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
              {/* Your course rendering logic */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.length > 0 &&
                  courses.map((course, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(course._id)}
                      className="bg-[#1E293B] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer border border-[#2D3748]"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 md:h-64">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.courseName}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="p-6">
                        <h3 className="text-[#E2E8F0] text-xl font-semibold mb-2">
                          {course.courseName}
                        </h3>
                        <p className="text-[#A0AEC0] mb-4 text-sm">
                          {course.courseDescription.length > 80
                            ? course.courseDescription.slice(0, 80) + "..."
                            : course.courseDescription}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-[#38B2AC] text-2xl font-bold">
                            Rs. {course.coursePrice}
                          </p>
                          {/* Star Rating */}
                          <div className="flex items-center gap-1">
                            {Array(5)
                              .fill(0)
                              .map((_, starIndex) => {
                                const starValue = starIndex + 0.5;
                                return (
                                  <span
                                    key={starIndex}
                                    className={`${
                                      course.averageRating >= starIndex + 1
                                        ? "text-yellow-400"
                                        : course.averageRating >= starValue
                                        ? "text-yellow-300"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    ★
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 md:py-24 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={aboutUs}
                  alt="About Us"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
              <p className="text-lg opacity-80">
                Welcome to our e-learning platform, where education meets
                innovation. Our mission is to empower learners from all walks of
                life by providing access to high-quality, affordable, and
                flexible courses that fit their unique needs. Whether you're
                looking to advance your career, learn a new skill, or explore
                your passions, we have something for everyone.
                <br />
                <br />
                Designed with cutting-edge technology and expert instructors,
                our platform ensures an engaging, personalized, and seamless
                learning experience. We believe that knowledge has the power to
                transform lives and open doors to endless opportunities. Join us
                today and start shaping your future!
              </p>
              <button
                onClick={allCourse}
                className="bg-[#16ECCA] hover:bg-[#14b3b0] text-white px-8 py-3 rounded-md text-lg transition-colors duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
