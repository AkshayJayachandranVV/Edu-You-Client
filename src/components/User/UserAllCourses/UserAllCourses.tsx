import React from 'react';
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 

export default function AllCourses() {
  const courses = [
    {
      title: 'Full-Stack Web Development',
      price: '₹ 1000',
      imgSrc: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
      description: 'Master full-stack development with projects and real-world challenges.',
      stock: 10,
    },
    {
      title: 'Data Science Bootcamp',
      price: '₹ 1200',
      imgSrc: 'https://images.unsplash.com/photo-1531177076-21e6e5c9114c?auto=format&fit=crop&w=286',
      description: 'Learn data science from scratch with industry-level training.',
      stock: 5,
    },
    // Add more courses as needed
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar iconimage={iconimage} />
      
      {/* Banner Section with padding to avoid overlap */}
      <div className="bg-gray-800 py-12 text-center mt-14"> {/* Added mt-20 for margin-top */}
        <h1 className="text-5xl font-bold text-yellow-400">All Courses</h1>
        <p className="text-gray-400 mt-4">Explore our wide range of courses and choose the best fit for you.</p>
      </div>
      {/* Centralized Div Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-700 p-8 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <img
                  src={course.imgSrc}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-yellow-400">{course.title}</h2>
                  <p className="text-gray-400 mt-3">{course.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-yellow-400">{course.price}</span>
                    <span className="bg-green-600 text-xs px-3 py-1 rounded-full">
                      {`Only ${course.stock} left!`}
                    </span>
                  </div>
                  <button className="mt-6 w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded-md hover:bg-yellow-600 transition-all duration-300">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
