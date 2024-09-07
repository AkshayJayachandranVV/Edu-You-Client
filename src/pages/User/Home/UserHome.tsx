import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../../components/User/Home/UserHome/Navbar/Navbar';

const UserHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if userAccessToken is present in localStorage
    const token = localStorage.getItem('userAccessToken');
    
    if (!token) {
      // If token is not present, redirect to login page
      navigate('/login');
    }
  }, [navigate]); // Dependency array includes navigate

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {/* <TutorSidebar /> */}

      {/* Main content area */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <UserNavbar />

        {/* Page content */}
        <div style={{ marginTop: '80px', padding: '20px', flexGrow: 1 }}>
          {/* Your page content goes here */}
          <h1>Welcome to the User Home</h1>
          {/* Add more components or content as needed */}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
