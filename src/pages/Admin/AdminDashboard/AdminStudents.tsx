import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Admin/Dashboard/Navbar/Navbar';
import AdminSidebar from '../../../components/Admin/Dashboard/Sidebar/Sidebar';
import AdminStudents from '../../../components/Admin/Dashboard/Body/AdminStudents';
import { adminEndpoints } from '../../../../src/components/constraints/endpoints/adminEndpoints';
import axiosInstance from '../../../components/constraints/axios/adminAxios';

const AdminStudentPage = () => {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState<FormattedStudent[]>([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  interface Student {
    username: string;
    email: string;
    phone?: string;
    isBlocked: boolean;
  }

  interface FormattedStudent {
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
      navigate('/admin');
    } else {
      fetchStudentsData();
    }
  }, [navigate]);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get<Student[]>(adminEndpoints.students);
      const formattedData: FormattedStudent[] = result.data.map(
        (student: Student, index: number) => ({
          sino: index + 1,
          image: 'default.png', 
          name: student.username,
          email: student.email,
          phone: student.phone || 'Not Available',
          isBlocked: student.isBlocked,
        })
      );
      setStudentsData(formattedData);
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
              paddingRight: '135px',
            }}
          >
            {loading ? (
              <p style={{ color: '#FFFFFF' }}>Loading...</p>
            ) : error ? (
              <p style={{ color: '#FFFFFF' }}>{error}</p>
            ) : (
              <AdminStudents studentsData={studentsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentPage;
