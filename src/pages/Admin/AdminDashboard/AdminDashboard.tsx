import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Admin/Dashboard/Navbar/Navbar';
import AdminSidebar from '../../../components/Admin/Dashboard/Sidebar/Sidebar'

const AdminDashboard = () => {
    const navigate = useNavigate()





    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <AdminSidebar />
  
        {/* Main content area */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Navbar */}
          <AdminNavbar />
  
          {/* Page content */}
          <div style={{ marginTop: '80px', padding: '20px', flexGrow: 1 }}>
            {/* Your page content goes here */}
            <h1>Welcome to the Admin Dashboard</h1>
            {/* Add more components or content as needed */}
          </div>
        </div>
      </div>
    );
  };

export default AdminDashboard;
