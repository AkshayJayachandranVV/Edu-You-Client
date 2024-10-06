import React, { useEffect, useState } from 'react';
import Navbar from "../../User/Home/UserHome/Navbar/Navbar";
import Footer from "../../User/Home/UserHome/Footer/Footer";
import iconimage from "../../../assets/images/User/UserHome/Account.png";
import bannerImage from "../../../assets/images/User/checkout.png"; // Replace with your banner image path
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { useParams } from 'react-router-dom';

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  coursePrice: number;
  courseDiscountPrice?: number;
  courseCategory: string;
  courseLevel: string;
  demoURL: string;
  thumbnail: string;
}

export default function Checkout() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (courseId) {
          const response = await axiosInstance.get(
            `${userEndpoints.courseDetails.replace('courseId', courseId)}`
          );
          setCourseData(response.data.courses);
        } else {
          console.error("Course ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar iconimage={iconimage} />

      {/* Banner Section */}
      <div className="relative bg-black p-6" style={{ minHeight: "150px" }}>
        <img
          src={bannerImage}
          alt="Banner"
          className="w-[700px] h-[400px] object-cover mb-4"
          style={{ marginLeft: "700px", marginTop: "60px" }}
        />
        <h1
          className="font-black text-white absolute"
          style={{
            top: "40%",
            left: "220px",
            transform: "translateY(-50%)",
            fontSize: "80px",
          }}
        >
          Checkout
        </h1>
      </div>

      {/* Course Data Rendering */}
      {courseData && (
        <div className="flex-grow p-6">
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
            <p className="mb-6 text-gray-300">
              Please fill in your payment details to complete your purchase.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
                <form>
                  {/* Payment Form (unchanged) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="cardholderName">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      id="cardholderName"
                      className="border border-gray-600 rounded-md p-2 w-full bg-gray-800 text-white"
                      placeholder="Enter card holder name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="border border-gray-600 rounded-md p-2 w-full bg-gray-800 text-white"
                      placeholder="xxxx xxxx xxxx xxxx"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="expiryMonth">
                        Expiry Month
                      </label>
                      <input
                        type="text"
                        id="expiryMonth"
                        className="border border-gray-600 rounded-md p-2 w-full bg-gray-800 text-white"
                        placeholder="MM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="expiryYear">
                        Expiry Year
                      </label>
                      <input
                        type="text"
                        id="expiryYear"
                        className="border border-gray-600 rounded-md p-2 w-full bg-gray-800 text-white"
                        placeholder="YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        className="border border-gray-600 rounded-md p-2 w-full bg-gray-800 text-white"
                        placeholder="XXX"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-md px-4 py-2 mt-4 w-full hover:bg-blue-700"
                  >
                    Place Order
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-700 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                {/* Thumbnail Image */}
                <div className="mb-4">
                  <img 
                    src={courseData.thumbnail} 
                    alt={`${courseData.courseName} Thumbnail`} 
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>

                {/* Course Name */}
                <div className="flex justify-between mb-2">
                  <span>{courseData.courseName}</span>
                  <span>₹ {courseData.coursePrice}</span>
                </div>

                {/* Course Discount Price (if available) */}
                {courseData.courseDiscountPrice && (
                  <div className="flex justify-between mb-2">
                    <span>Discount Price</span>
                    <span>₹ {courseData.courseDiscountPrice}</span>
                  </div>
                )}

                {/* Course Category */}
                <div className="flex justify-between mb-2">
                  <span>Category</span>
                  <span>{courseData.courseCategory}</span>
                </div>

                {/* Total Price */}
                <div className="flex justify-between mb-2 font-semibold">
                  <span>Total Price</span>
                  <span>₹ {courseData.coursePrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
