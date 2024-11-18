import  { useEffect, useState } from 'react';
import AdminNavbar from '../../../components/Admin/Dashboard/Navbar/Navbar';
import AdminSidebar from '../../../components/Admin/Dashboard/Sidebar/Sidebar';
import AdminReports from '../../../components/Admin/Dashboard/Body/AdminReportCourses';
import { adminEndpoints } from '../../../../src/components/constraints/endpoints/adminEndpoints';
import axiosInstance from '../../../components/constraints/axios/adminAxios';
import BasicPagination from "../../../components/Admin/Pagination/Pagination";


interface CourseData {
  courseId: string;
  userId: string;
  username: string;
  email: string;
  reason: string;
  description: string;
  createdAt: string;
  courseName: string;
  thumbnail: string;
  isListed: boolean;
}


const AdminTutorsPage = () => {
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalItems] = useState(0); 
  const itemsPerPage = 5; 

  useEffect(() => {
    fetchCourseData(); 
  }, []);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(adminEndpoints.reportCourses);

      console.log(result.data,"heheheheheh")
      
      // Assuming result.data is an array of reported courses
      const formattedData = result.data.map((item:any) => ({
        courseId: item.courseId,
        userId: item.userId,
        username: item.username,
        email: item.email,
        reason: item.reason,
        description: item.description,
        createdAt: new Date(item.createdAt).toLocaleString(), // Format the date
        courseName: item.courseName || 'N/A', // Optional chaining or default value
        thumbnail: item.thumbnail || 'default_thumbnail.jpg', // Default thumbnail
        isListed:item.isListed
      }));

      console.log(formattedData, "Formatted Course Data");
      setCoursesData(formattedData); // Set the formatted data
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data'); // Handle error
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update current page
  };



  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000000' }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminNavbar />
        <div className="flex-1 flex flex-col p-6" style={{ backgroundColor: '#000000', flexGrow: 1 }}>
          <div className="flex-grow flex flex-col justify-start" style={{  marginBottom:'250vh', marginLeft: '14vw', alignSelf: 'flex-end' }}>
            {loading ? (
              <p style={{ color: '#FFFFFF' }}>Loading...</p>
            ) : error ? (
              <p style={{ color: '#FFFFFF' }}>{error}</p>
            ) : (
              <>
              <AdminReports initialCoursesData={coursesData} /> 
              <BasicPagination
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTutorsPage;
