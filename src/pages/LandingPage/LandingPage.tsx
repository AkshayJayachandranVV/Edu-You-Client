import { useState } from "react";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";

import {
  FaLaptopCode,
  FaPaintBrush,
  FaBullhorn,
  FaChalkboardTeacher,
} from "react-icons/fa";
import LandingBanner from "../../assets/images/User/LandingPage/BannerImages.jpg";

const LandingPage = () => {
  const [isFAQOpen, setFAQOpen] = useState(null);
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    navigate("/selectRole");
  };

  const toggleFAQ = (index: any) => {
    setFAQOpen((prevIndex: any) => (prevIndex === index ? null : index));
  };
  return (
    <div className="bg-[#1a1a1a] text-gray-300">
      {/* Main Banner */}
      <section className="bg-gradient-to-r from-[#121212] to-[#1f1f1f] text-white">
        <div className="container mx-auto px-6 py-16">
          {/* Banner Section */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left Content */}
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Investing in
                <br /> Knowledge and
                <br />
                <span className="text-[#9380fe]">Your Future</span>
              </h1>
              <p className="text-lg mb-6 text-gray-400">
                Join millions of learners worldwide and access high-quality
                courses taught by top instructors. Learn at your own pace and
                achieve your goals today!
              </p>
              <div className="flex justify-end">
              <button
  onClick={handleGetStartedClick}
  className="bg-[#e59943] text-white font-semibold px-12 py-4 rounded-lg shadow-lg hover:bg-orange-500 mr-28"
>
  Get soon
</button>


</div>


              {/* Add Content Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1e1e2e] p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-[#e59943] mb-2">
                    Personalized Learning
                  </h3>
                  <p className="text-gray-400">
                    Tailored courses to suit your interests and career goals.
                  </p>
                </div>
                <div className="bg-[#1e1e2e] p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-[#9380fe] mb-2">
                    Expert Instructors
                  </h3>
                  <p className="text-gray-400">
                    Learn from the best in the industry with real-world
                    experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
              <img
                src={LandingBanner}
                alt="Online Learning"
                className="rounded-lg shadow-lg max-w-[75%] h-auto"
              />
            </div>
          </div>

          {/* Career Courses Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#9380fe]">
              Top Career Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-[#f66795] p-6 rounded-lg shadow-lg text-center hover:bg-[#e45885] transition-all duration-300">
                <FaPaintBrush className="text-white text-5xl mb-4 mx-auto" />
                <h3 className="text-white text-xl font-bold mb-2">
                  UI/UX Design
                </h3>
                <p className="text-white text-gray-200">
                  Learn the fundamentals of user-centered design and create
                  visually stunning interfaces.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#e79e4b] p-6 rounded-lg shadow-lg text-center hover:bg-[#d57c3e] transition-all duration-300">
                <FaLaptopCode className="text-white text-5xl mb-4 mx-auto" />
                <h3 className="text-white text-xl font-bold mb-2">
                  Web Development
                </h3>
                <p className="text-white text-gray-200">
                  Master front-end and back-end development to build modern,
                  responsive websites.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#64d3f2] p-6 rounded-lg shadow-lg text-center hover:bg-[#56b8d6] transition-all duration-300">
                <FaBullhorn className="text-white text-5xl mb-4 mx-auto" />
                <h3 className="text-white text-xl font-bold mb-2">
                  Digital Marketing
                </h3>
                <p className="text-white text-gray-200">
                  Discover strategies for SEO, social media, and content
                  marketing to grow online presence.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#9e8cfc] p-6 rounded-lg shadow-lg text-center hover:bg-[#8e79d9] transition-all duration-300">
                <FaChalkboardTeacher className="text-white text-5xl mb-4 mx-auto" />
                <h3 className="text-white text-xl font-bold mb-2">
                  Practical Learning
                </h3>
                <p className="text-white text-gray-200">
                  Engage in hands-on projects and real-world scenarios to
                  reinforce your skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why EduYou Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose EduYou?
            </h2>
            <p className="text-lg mb-6 text-gray-400">
              EduYou stands out with its personalized approach to online
              education. From career-oriented programs to hobby courses, we’ve
              got everything to help you grow. Discover the difference!
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-400">
              <li>Access to a wide range of courses</li>
              <li>Learn from expert instructors</li>
              <li>Flexible and affordable learning plans</li>
              <li>Certificates of completion to showcase your skills</li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={handleGetStartedClick}
                className="bg-[#e59943] text-white font-semibold px-12 py-4 rounded-lg shadow-lg hover:bg-orange-500 mr-28 mt-10"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right Lottie Animation */}
          <div className="md:w-[48%] mt-8 md:mt-0">
            <motion.div
              className="flex-1 bg-[#252525] flex justify-center items-center"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: -10, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.68, -0.55, 0.27, 1.55] }}
            >
              <Player
                autoplay
                loop
                src="https://lottie.host/7100dd4f-826b-421f-801b-752477ccd826/vBS1LriaZx.json"
                style={{ height: "80%", width: "80%" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Online Learning Platform Highlights */}
      <section className="bg-[#121212] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Learn Anytime, Anywhere
          </h2>
          <p className="text-lg mb-6 text-gray-400">
            EduYou brings the classroom to your fingertips. With our
            user-friendly platform, you can learn whenever and wherever you
            want. Whether you're on the go or relaxing at home, education is
            always within reach.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
            <div className="w-full md:w-1/3 bg-[#1f1f1f] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">
                High-Quality Content
              </h3>
              <p className="text-gray-400">
                Curated courses from industry leaders to keep you ahead.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-[#1f1f1f] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">
                Affordable Plans
              </h3>
              <p className="text-gray-400">
                Learn without breaking the bank. Choose plans that suit your
                needs.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-[#1f1f1f] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">
                Flexible Scheduling
              </h3>
              <p className="text-gray-400">
                Learn at your own pace. No deadlines, no stress!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#9380fe]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div
            onClick={() => toggleFAQ(0)}
            className="bg-[#1e1e2e] p-4 rounded-lg shadow-lg cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-white">
              What is EduYou?
            </h3>
            {isFAQOpen === 0 && (
              <p className="text-gray-400 mt-2">
                EduYou is an online learning platform that offers a variety of
                courses to help you develop new skills and advance your career.
              </p>
            )}
          </div>
          <div
            onClick={() => toggleFAQ(1)}
            className="bg-[#1e1e2e] p-4 rounded-lg shadow-lg cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-white">
              How can I get started?
            </h3>
            {isFAQOpen === 1 && (
              <p className="text-gray-400 mt-2">
                Simply click on the "Get Started" button and sign up to start
                learning. You can browse and choose from a wide range of
                courses.
              </p>
            )}
          </div>
          <div
            onClick={() => toggleFAQ(2)}
            className="bg-[#1e1e2e] p-4 rounded-lg shadow-lg cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-white">
              What courses are available?
            </h3>
            {isFAQOpen === 2 && (
              <p className="text-gray-400 mt-2">
                We offer a wide variety of courses in fields such as web
                development, UI/UX design, digital marketing, and more!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-gray-400 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">© 2024 EduYou. All Rights Reserved.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="#" className="hover:text-[#e59943]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#e59943]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#e59943]">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
