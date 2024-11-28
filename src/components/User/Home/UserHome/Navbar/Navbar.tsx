import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../../redux/userSlice';
import { logoutStore } from '../../../../../redux/store';
import Cookies from 'js-cookie';
import socketService from '../../../../../socket/socketService';
import iconImage from '../../../../../assets/images/User/UserHome/Account.png';
import BellIcon from '../../../../../assets/Icons/User/notification.png';
import Discussion from '../../../../../assets/images/User/UserHome/people.png';
import axiosInstance from '../../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../../constraints/endpoints/userEndpoints';

// Notification type
interface Notification {
  _id: string;
  thumbnail: string;
  coursename: string;
  username: string;
}

interface NavbarProps {
  onSearch?: (query: string) => void;  // Make onSearch optional
  showSearchBar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, showSearchBar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const coursesEnrolled = useSelector((state: RootState) => state.user.coursesEnrolled);
  const [searchInput, setSearchInput] = useState('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const fetchNotify = await axiosInstance.get(userEndpoints.fetchNotify, {
        params: { coursesEnrolled, userId },
      });

      setNotifications(fetchNotify.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(logoutStore());
    dispatch(logout());
    navigate('/login');
    localStorage.setItem('userAccessToken', '');
    Cookies.remove('userAccessToken');
    Cookies.remove('userRefreshToken');
    socketService.disconnect();
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const GoAllCourses = () => {
    navigate('/allCourses');
  };

  const onChat = () => {
    navigate('/chat');
  };


  const myCourse = () => {
    navigate('/myCourses');
  };

  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    if (onSearch) {
      onSearch(value);
    }
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#000000] p-2 flex justify-between items-center h-[60px] text-white relative z-10">
{showSearchBar && (
  <div className="flex justify-center w-full">
    <input
      type="text"
      placeholder="Search..."
      className="bg-[#2c2d31] border-none rounded-2xl py-3 px-6 text-white text-sm outline-none h-[40px] w-[200px] sm:w-[500px]"
      value={searchInput}
      onChange={handleSearchChange}
    />
  </div>
)}


      <div className="flex justify-between items-center  gap-6 w-full pl-4">
        {/* Move content to the right */}
        <div className="flex gap-4 items-center ml-auto">
          <span onClick={handleHome} className="text-lg cursor-pointer hidden sm:block">Home</span>
          <span
            onClick={GoAllCourses}
            className="text-lg cursor-pointer hidden sm:block"
          >
            Courses
          </span>
        </div>
        <div className="flex items-center gap-6 relative">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            <img src={BellIcon} alt="Notifications" className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute top-[-5px] right-[-10px] bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
            {showNotifications && (
              <div className="absolute top-[40px] right-0 bg-[#1A1A1A] text-white rounded-lg shadow-lg p-3 w-[250px] md:w-[400px] z-10">
                <h4 className="px-4 py-2 text-sm font-semibold border-b border-[#444]">Notifications</h4>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification._id} className="flex items-center p-2 cursor-pointer hover:bg-[#444]">
                      <img
                        src={notification.thumbnail}
                        alt={notification.coursename}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm">{`${notification.username} sent a new message in ${notification.coursename}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <img
            src={Discussion}
            alt="Chat Icon"
            className="w-6 h-6 cursor-pointer"
            onClick={onChat}
          />
          <div className="relative" onClick={toggleProfileDropdown} ref={profileDropdownRef}>
            <img
              src={iconImage}
              alt="Profile Icon"
              className="w-6 h-6 cursor-pointer"
            />
            {showProfileDropdown && (
              <div className="absolute top-[40px] right-0 bg-[#2c2d31] text-white rounded-lg shadow-lg p-3 w-[250px] max-w-[300px] z-10">
                <button onClick={handleProfileClick} className="w-full py-2 text-sm text-left hover:text-yellow-500">
                  Profile
                </button>
                <button onClick={myCourse} className="w-full py-2 text-sm text-left hover:text-yellow-500">
                  My Courses
                </button>
                <button onClick={logOut} className="w-full py-2 text-sm text-left hover:text-yellow-500">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Hamburger Menu */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {showMobileMenu && (
            <div className="absolute top-[60px] right-0 bg-[#1e1f22] w-full flex flex-col items-center gap-4 p-4 text-white">
              <span className="cursor-pointer" onClick={GoAllCourses}>Courses</span>
              <span className="cursor-pointer">Home</span>
              <button onClick={handleProfileClick} className="cursor-pointer">Profile</button>
              <button onClick={logOut} className="cursor-pointer">Logout</button>
              <button onClick={myCourse} className="cursor-pointer">MyCourse</button>
              <span className="cursor-pointer" onClick={onChat}>Discussion</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
