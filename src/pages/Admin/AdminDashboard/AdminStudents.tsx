import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../../../components/Admin/Dashboard/Navbar/Navbar';
import AdminSidebar from '../../../components/Admin/Dashboard/Sidebar/Sidebar';
import AdminStudents from '../../../components/Admin/Dashboard/Body/AdminStudents';
import { adminEndpoints } from '../../../../src/components/constraints/endpoints/adminEndpoints';
import axiosInstance from '../../../components/constraints/axios/adminAxios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState<FormattedStudent[]>([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors


  interface Student {
    username: string;
    email: string;
    phone?: string; // Assuming phone may or may not be available
    isBlocked:boolean;
  }

  interface FormattedStudent {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked:boolean;
  }

  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchStudentsData();
      console.log("entered to useeffect else")
    }
  }, [navigate]);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
  
      // Fetch data from the API
      console.log(":eneterd to the function")
      const result = await axiosInstance.get<Student[]>(adminEndpoints.students); // Expecting an array of Student objects

      console.log(result,"----------------------------------------------------------------")
  
      // Map and format the data
      const formattedData: FormattedStudent[] = result.data.map((student: Student, index: number) => ({
        sino: index + 1,
        image: 'default.png', // Replace with actual image if needed
        name: student.username,
        email: student.email,
        phone: student.phone || 'Not Available', // Use 'Not Available' if phone is undefined
        isBlocked:student.isBlocked
      }));
  
      // Set the formatted data and stop loading
      setStudentsData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminNavbar />
        <div
          className="flex-1 flex flex-col p-6"
          style={{ backgroundColor: '#000000' }}
        >
          <div
            className="flex-grow flex flex-col justify-start"
            style={{
              marginBottom: '19px',
              width: '75%',
              marginLeft: 'auto',
              paddingRight: '-5px',
              alignSelf: 'flex-end',
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              // Pass the fetched and formatted data to AdminStudents
              <AdminStudents studentsData={studentsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
