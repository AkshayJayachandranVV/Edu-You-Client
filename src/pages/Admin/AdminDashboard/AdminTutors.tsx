import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Admin/Dashboard/Navbar/Navbar';
import AdminSidebar from '../../../components/Admin/Dashboard/Sidebar/Sidebar';
import AdminTutors from '../../../components/Admin/Dashboard/Body/AdminTutors';
import { adminEndpoints } from '../../../../src/components/constraints/endpoints/adminEndpoints';
import axiosInstance from '../../../components/constraints/axios/adminAxios';

const AdminTutorsPage = () => {
  const navigate = useNavigate();
  const [tutorsData, setTutorsData] = useState<FormattedTutor[]>([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  interface Tutor {
    tutorname: string;
    email: string;
    phone?: string; // Assuming phone may or may not be available
    isBlocked: boolean;
  }

  interface FormattedTutor {
    sino: number;
    image: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
  }

  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchTutorsData();
    }
  }, [navigate]);

  const fetchTutorsData = async () => {
    try {
      setLoading(true);
  
      // Fetch data from the API
      const result = await axiosInstance.get<Tutor[]>(adminEndpoints.tutors); // Expecting an array of Tutor objects
  
      // Map and format the data
      const formattedData: FormattedTutor[] = result.data.map((tutor: Tutor, index: number) => ({
        sino: index + 1,
        image: 'default.png', // Replace with actual image if needed
        name: tutor.tutorname,
        email: tutor.email,
        phone: tutor.phone || 'Not Available', // Use 'Not Available' if phone is undefined
        isBlocked: tutor.isBlocked,
      }));
  
      // Set the formatted data and stop loading
      setTutorsData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000000' }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminNavbar />
        <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#000000', flexGrow: 1 }}>
          <div
            className="flex-grow flex flex-col justify-start"
            style={{
              marginBottom: '19px',
              width: '75%',
              marginLeft: 'auto',
              alignSelf: 'flex-end',
            }}
          >
            {loading ? (
              <p style={{ color: '#FFFFFF' }}>Loading...</p>
            ) : error ? (
              <p style={{ color: '#FFFFFF' }}>{error}</p>
            ) : (
              <AdminTutors tutorsData={tutorsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTutorsPage;
