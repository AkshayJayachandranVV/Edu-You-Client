import { useEffect, useState } from "react";
import Navbar from "../../User/Home/UserHome/Navbar/Navbar";
import Footer from "../../User/Home/UserHome/Footer/Footer";
import axiosInstance from "../../../components/constraints/axios/userAxios";
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import Loader from "../../Spinner/Spinner2/Spinner2";
import moment from "moment";
import { toast } from "sonner";

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  coursePrice: number;
  courseDiscountPrice?: number;
  courseCategory: string;
  courseLevel: string;
  demoURL: string;
  prerequisites: string[];
  benefits: string[];
  sections: {
    title: string;
    lessons: { title: string; description: string }[];
  }[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
}

interface Review {
  courseId: string;
  rating: number;
  reviewText: string;
  id: string;
  username: string;
  profilePicture: string;
  createdAt: string; // Ensure this field is present in the API response
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UserCourseDetailsProps {
  courseId: string;
}

export default function UserCourseDetails(props: UserCourseDetailsProps) {
  const { courseId } = props;
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [tutor, setTutor] = useState<{
    name: string;
    profile_picture: string;
    expertise: string;
  }>({
    name: "",
    profile_picture: "",
    expertise: "",
  });

  const { id, username, profilePicture } = useSelector(
    (state: RootState) => state.user
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
    fetchTutor();
  }, [courseId]);

  const fetchTutor = async () => {
    try {
      if (courseId) {
        const response = await axiosInstance.get(
          `${userEndpoints.fetchTutor.replace("courseId", courseId)}`
        );
        console.log("kitty", response);

        // Check if the response contains valid data and store it in state
        if (response.data) {
          setTutor({
            name: response.data.name || "", // Set name, default to an empty string if undefined
            profile_picture: response.data.profile_picture || "", // Set profile picture URL
            expertise: response.data.expertise || "", // Set expertise, default to an empty string if undefined
          });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log("Entered fetch reviews");
      if (!courseId) {
        console.error("Course ID is undefined");
        return;
      }
      const response = await axiosInstance.get(
        `${userEndpoints.fetchReview.replace("courseId", courseId)}`
      );
      console.log("response", response);
      setReviews(response.data || []);
    } catch (error) {
      console.log("Error fetching reviews:", error);
      setReviews([]); // Set reviews as an empty array on error
    }
  };

  const handlePostReview = async () => {
    if (userRating === 0 || reviewText.trim() === "") {
      setError("Please provide both a rating and a review.");
      return;
    }
    setError("");
    const reviewData = {
      courseId,
      rating: userRating,
      reviewText,
      id,
      username,
      profilePicture,
    };
    try {
      const result = await axiosInstance.post(
        userEndpoints.reviewPost,
        reviewData
      );
      console.log(result.data);
      if (result.data.success) {
        toast.success("Review added successfully");
        const newReview = result.data.review;
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        closeModal();
      } else if (
        result.data.success == false &&
        result.data.message == "Can't give more than one review."
      ) {
        toast.info("User already added review.");
      } else {
        toast.warning("Something went wrong.");
      }
      setUserRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("orderCheck");
    const fetchCourseDetails = async () => {
      if (!courseId) {
        console.error("Course ID is undefined");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `${userEndpoints.courseDetails.replace("courseId", courseId)}`
        );

        console.log(response);

        if (response?.data?.courses) {
          setCourseData(response.data.courses);
        } else {
          console.error("No course data found");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]); // Depend on courseId

  const getYouTubeID = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag: HTMLScriptElement | null =
      document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API is ready");
      // YouTube API logic here
    };
  }, []);

  const coursePayment = async (courseId: string) => {
    navigate(`/checkout/${courseId}`);
  };

  if (!courseData) {
    return <Loader />;
  }

  return (
    <div className="course-description bg-black text-gray-100">
      <Navbar />
      <div className="bg-gradient-to-r from-gray-900 to-black mt-12 shadow-lg">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start py-10 space-y-6 lg:space-y-0 lg:space-x-10 bg-gray-900 text-white rounded-lg shadow-lg">
          {/* Course Banner */}
          <div className="course-banner flex-1">
            <iframe
              className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${getYouTubeID(
                courseData.demoURL
              )}`}
              title={courseData.courseName}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Course and Tutor Details */}
          <div className="flex-1 lg:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold">{courseData.courseName}</h1>
            <p className="text-gray-400">{courseData.courseDescription}</p>

            {/* Tutor Details */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Tutor Profile Picture */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md">
                <img
                  src={tutor.profile_picture}
                  alt="Tutor"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tutor Information */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{tutor.name}</h2>
                <p className="text-gray-400">{tutor.expertise}</p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="flex items-center space-x-6 text-gray-400">
              {/* Star Rating */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const fullStar =
                    index + 1 <= Math.floor(courseData.averageRating);
                  const halfStar =
                    index + 1 > Math.floor(courseData.averageRating) &&
                    index + 1 <= Math.ceil(courseData.averageRating);
                  return (
                    <span key={index} className="text-yellow-400 text-lg">
                      {fullStar ? "★" : halfStar ? "⯨" : "☆"}
                    </span>
                  );
                })}
                <span className="text-yellow-400 text-lg ml-2">
                  {courseData.averageRating
                    ? courseData.averageRating.toFixed(1)
                    : "No Rating"}
                </span>
              </div>
              <span className="text-yellow-400">
                {courseData.averageRating || "No Rating"}
              </span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-12">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8 ml-8 relative">
            <h2 className="text-2xl font-semibold text-white">
              This course includes:
            </h2>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>1 Lecture</li>
              <li>1hr 0min Duration</li>
              <li>{courseData.courseLevel} Level</li>
              <li>English</li>
            </ul>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                What you’ll learn:
              </h2>
              <ul className="mt-4 space-y-2 text-gray-400">
                {courseData.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <h2 className="text-2xl font-semibold text-white">
                What are Prerequisites:
              </h2>
              <ul className="mt-4 space-y-2 text-gray-400">
                {courseData.prerequisites.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Modal Trigger Button */}
            <button
              onClick={openModal}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Write a Review
            </button>

            {/* Inline Modal */}
            {isModalOpen && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mt-6">
                <h2 className="text-white text-lg font-bold">Write a Review</h2>

                {/* Display error message */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex items-center my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`cursor-pointer text-2xl ${
                        star <= userRating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white rounded-lg"
                  placeholder="Write your review here..."
                />

                <button
                  onClick={handlePostReview}
                  className="w-full py-2 bg-blue-600 text-white mt-4 rounded-lg"
                >
                  Post Review
                </button>

                <button
                  onClick={closeModal}
                  className="mt-4 text-blue-400 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Display Recent Reviews */}
            <div className="mt-8 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
              <h3 className="text-2xl text-white font-semibold">Reviews</h3>
              <div className="mt-8 max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
                <h3 className="text-2xl text-white font-semibold">Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 mt-4">No reviews yet.</p>
                ) : (
                  reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg mt-4"
                    >
                      <div className="flex items-center">
                        {review.profilePicture && (
                          <img
                            src={review.profilePicture}
                            alt="profile"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <span className="text-gray-200">{review.username}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400">
                          {"★".repeat(review.rating)}
                        </span>
                        <span className="ml-2 text-gray-400">
                          {review.rating} / 5
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2">{review.reviewText}</p>
                      <span className="text-gray-500 text-sm">
                        <span className="text-gray-500 text-sm">
                          {moment(review.createdAt).fromNow()}
                        </span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <img
              className="w-full object-cover rounded-lg shadow-lg"
              src={courseData.thumbnail}
              alt={courseData.courseName}
            />
            <h2 className="text-2xl font-semibold text-white">
              Price: ₹ {courseData.coursePrice}
            </h2>
            <button
              onClick={() => coursePayment(courseData._id)}
              className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Buy Now
            </button>
            <p className="text-gray-500">
              Created by {courseData.courseCategory}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
