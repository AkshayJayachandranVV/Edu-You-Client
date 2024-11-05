import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../../redux/userSlice';
import Cookies from 'js-cookie';
import socketService from '../../../../../socket/socketService';
import iconImage from '../../../../../assets/images/User/UserHome/Account.png';
import BellIcon from '../../../../../assets/Icons/User/notification.png';
import Discussion from '../../../../../assets/images/User/UserHome/people.png';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../../constraints/endpoints/userEndpoints';

interface NavbarProps {
  iconimage: string;
  onSearch: (query: string) => void;
  showSearchBar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, showSearchBar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const coursesEnrolled = useSelector((state: RootState) => state.user.coursesEnrolled);
  const [searchInput, setSearchInput] = useState('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    try {
      console.log("Entered to notify");
      const fetchNotify = await axiosInstance.get(userEndpoints.fetchNotify, {
        params: { coursesEnrolled }, // Sending as query params
      });

      console.log('Notification data:', fetchNotify.data);
      setNotifications(fetchNotify.data); // Update notifications state
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.setItem("userAccessToken", "");
    Cookies.remove('userAccessToken');
    socketService.disconnect();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const GoAllCourses = () => {
    navigate("/allCourses");
  };

  const onChat = () => {
    navigate("/chat");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {showSearchBar && (
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchInput}
          onChange={handleSearchChange}
        />
      )}
      <div className="navbar-content">
        <div className="nav-links">
          <span className="nav-item home">Home</span>
          <span onClick={GoAllCourses} className="nav-item courses">Courses</span>
        </div>
        <div className="nav-icons">




        <div
  className="notification-icon"
  onMouseEnter={() => setShowNotifications(true)}
  onMouseLeave={() => setShowNotifications(false)}
>
  <img src={BellIcon} alt="Notifications" className="dropdown-icon" />
  {notifications.length > 0 && (
    <span className="notification-count">{notifications.length}</span>
  )}
  {showNotifications && (
    <div className="notification-dropdown">
      <h4>Notifications</h4>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className="notification-item">
            <img 
              src={notification.thumbnail} 
              alt={notification.coursename} 
              className="notification-image" 
            />
            <span>{`${notification.username} sent a new message in ${notification.coursename}`}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>






          <img
            src={Discussion}
            alt="Chat Icon"
            className="dropdown-icon"
            onClick={onChat}
          />
          <div className="profile-icon" onClick={toggleProfileDropdown} ref={profileDropdownRef}>
            <img
              src={iconImage}
              alt="Profile Icon"
              className="dropdown-icon"
            />
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button onClick={handleProfileClick} className="dropdown-link">Profile</button>
                <button onClick={logOut} className="dropdown-link">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
