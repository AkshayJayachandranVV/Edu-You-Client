import React, { useState } from 'react';
import './Navbar.css';
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { logout } from '../../../../../redux/userSlice'
import Cookies from 'js-cookie';
interface NavbarProps {
  iconimage: string;
}

const Navbar: React.FC<NavbarProps> = ({ iconimage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const logOut = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.setItem("userAccessToken", "");
    Cookies.remove('userAccessToken');
  };

  const handleProfileClick = () => {
    navigate('/profile');  // Navigate to the /profile route
  };

  return (
    <nav className="navbar">  {/* Correct HTML element */}
      <input type="text" placeholder="Search..." className="search-bar" />
      <div className="navbar-content">
        <div className="nav-links">
          <span className="nav-item home">Home</span>
          <span className="nav-item courses">Courses</span>
        </div>
        <div className="nav-icons">
          <div className="nav-icon people"></div>
          <div className="dropdown">
            <img 
              src={iconimage}
              alt="Menu Icon"
              className="dropdown-icon"
              onClick={toggleDropdown}
            />
            {isOpen && (
              <div className="dropdown-content show">
                <button onClick={logOut} className="dropdown-link">Logout</button>
                <button onClick={handleProfileClick} className="dropdown-link">Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
