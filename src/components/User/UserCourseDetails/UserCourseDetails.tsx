import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const navigate = useNavigate();

  return (
    <div className="course-description bg-black text-gray-100"> {/* Black background with light text */}
      <Navbar iconimage={iconimage} />

      {/* Course Banner with gradient and shadow */}
      <div className="bg-gradient-to-r from-gray-900 to-black mt-16 shadow-lg">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start py-10">
          <img 
            className="w-full lg:w-1/3 object-cover rounded-lg shadow-lg" 
            src="assets/vectors/Rectangle2473_x2.svg" 
            alt="Course Banner" 
          />
          <div className="mt-8 lg:mt-0 lg:ml-10 lg:w-2/3">
            <h1 className="text-4xl font-bold text-white">
              The Complete Web Development
            </h1>
            <p className="mt-4 text-gray-400">
              Master JavaScript with projects, challenges, and theory. A comprehensive course for modern development.
            </p>
            <div className="flex items-center mt-4 space-x-6 text-gray-400">
              <span className="text-yellow-400">No Rating</span>
              <span>9 Enrolled</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-semibold text-white">This course includes:</h2>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>1 Lecture</li>
              <li>1hr 0min Duration</li>
              <li>Beginner Level</li>
              <li>English</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold text-white">What you’ll learn:</h2>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>3.5 hours of on-demand video</li>
              <li>Full stack application development</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold text-white">Course Description:</h2>
            <p className="mt-4 text-gray-400">
              A deep dive into C# and .NET. You will build small websites and applications using C#. Suitable for beginners and experienced coders alike.
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-white">Price: ₹ 1000</h2>
            <button className="mt-6 w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
              Buy Now
            </button>
            <p className="mt-4 text-gray-500">Created by Alis Mathew</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
