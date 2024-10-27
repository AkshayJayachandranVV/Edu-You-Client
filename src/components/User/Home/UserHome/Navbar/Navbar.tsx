import React, { useState } from 'react';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../../redux/userSlice';
import Cookies from 'js-cookie';

interface NavbarProps {
  iconimage: string;
  onSearch: (query: string) => void;  // Ensure this is correctly defined
  showSearchBar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ iconimage, onSearch ,showSearchBar}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const dispatch = useDispatch();
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
    navigate('/profile');
  };

  const GoAllCourses = () => {
    navigate("/allCourses");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log(value)
    setSearchInput(value);
    onSearch(value); // Call the onSearch function
  };

  return (
    <nav className="navbar">
      {showSearchBar && ( // Conditionally render the search bar
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchInput}
          onChange={handleSearchChange} // Update input on change
        />
      )}
      <div className="navbar-content">
        <div className="nav-links">
          <span className="nav-item home">Home</span>
          <span onClick={GoAllCourses} className="nav-item courses">Courses</span>
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
