import React from 'react';
import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import MycourseImage from '../../../assets/images/User/myCourses background.png'

export default function MyCourses() {
  return (
    <div className="my-courses bg-gray-900 text-white">
      <Navbar iconimage={iconimage} />
       
      <div className="relative bg-black p-6" style={{ minHeight: "150px" }}>
        <img
          src={MycourseImage}
          alt="Banner"
          className="w-[700px] h-[400px] object-cover mb-4"
          style={{ marginLeft: "700px", marginTop: "60px" }}
        />

        {/* Wrapping the heading and button together */}
        <div className="absolute" style={{ top: "40%", left: "210px", transform: "translateY(-50%)" }}>
          <h1 className="font-black text-white" style={{ fontSize: "80px" }}>
            Online <br /> Education
          </h1>
          {/* Moving the button below the heading */}
          <button className="bg-teal-500 px-6 py-3 rounded text-lg font-bold mt-4">
            Try it Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-2" >
        
        {/* My Courses Section */}
        <h2 className="text-7xl font-bold mt-16 mb-10 text-center">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Course Card */}
          {[
            { title: 'The Complete Web Development', lectures: 3 },
            { title: 'Fullstack Developer Bootcamp', lectures: 0 },
            { title: 'Advanced JavaScript Mastery', lectures: 10 },
          ].map((course, idx) => (
            <div
              key={idx}
              className="bg-black p-6 rounded-lg shadow-md flex flex-col"
            >
              <div className="mb-4 h-40 bg-cover bg-center rounded"
                style={{ backgroundImage: `url('assets/images/WebDevelopmentCourseThumbnail1.png')` }}>
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-400 mb-4">{course.lectures} Lectures</p>
              <button className="mt-auto bg-teal-500 py-2 px-4 rounded font-bold">
                Watch now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
