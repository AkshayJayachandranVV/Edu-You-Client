import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../constraints/axios/adminAxios';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import Swal from 'sweetalert2';

// Define the shape of the course data
interface Course {
  _id: string;
  courseName: string;
  thumbnail: string;
  courseCategory: string;
  courseLevel: string;
  coursePrice: number;
  courseDiscountPrice: number;
  createdAt: string;
  isListed?: boolean;
}

interface DarkThemeTableProps {
  courseData: Course[];
}

const DarkThemeTable: React.FC<DarkThemeTableProps> = ({ courseData: initialCourseData }) => {
  const [coursesData, setCoursesData] = React.useState<Course[]>(initialCourseData);
  const navigate = useNavigate();

  // Function to toggle list/unlist status
  const toggleListStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      console.log(courseId,"=---------courseid");
      const response = await axiosInstance.post(adminEndpoints.listCourse, { courseId });

      console.log('Toggling list/unlist status:', response);

      // Update course data locally
      const updatedCourses = coursesData.map((course) =>
        course._id === courseId ? { ...course, isListed: !currentStatus } : course
      );
      setCoursesData(updatedCourses);
    } catch (error) {
      console.error('Error toggling list/unlist status:', error);
    }
  };



  // Function to handle course deletion
//   const deleteCourse = async (courseId: string) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel',
//     });

//     if (result.isConfirmed) {
//       try {
//         // Make the API call to delete the course
//         const response = await axiosInstance.delete(`${adminEndpoints.deleteCourse.replace("courseId", courseId)}`);
//         console.log('Course deleted:', response);

//         // Update the state to remove the deleted course
//         setCoursesData(coursesData.filter(course => course._id !== courseId));

//         Swal.fire('Deleted!', 'Your course has been deleted.', 'success');
//       } catch (error) {
//         console.error('Error deleting course:', error);
//         Swal.fire('Error!', 'There was a problem deleting your course.', 'error');
//       }
//     }
//   };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 'sm',
        bgcolor: '#1b2532', // Dark background for the table container
      }}
    >
      <Table
        sx={{
          '& tbody': {
            color: '#fff', // Text color for table rows
          },
          '& thead': {
            bgcolor: '#1b2532', // Dark background for table headers
            color: '#fff', // Text color for table headers
          },
          '& th, & td': {
            borderColor: '#1b2532', // Border color
            color: '#fff', // Text color for cells
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>SI No</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount Price</TableCell>
            <TableCell>Date</TableCell>
            {/* <TableCell>Delete</TableCell> */}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coursesData.map((course, index) => (
            <TableRow
              key={course._id}
              sx={{
                bgcolor: index % 2 === 0 ? '#1b2532' : '#1e1f22', // Alternate row colors
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{course.courseName}</TableCell>
              <TableCell>
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  style={{ width: '50px', height: 'auto' }}
                />
              </TableCell>
              <TableCell>{course.courseCategory}</TableCell>
              <TableCell>{course.courseLevel}</TableCell>
              <TableCell>{course.coursePrice}</TableCell>
              <TableCell>{course.courseDiscountPrice}</TableCell>
              <TableCell>{new Date(course.createdAt).toLocaleString()}</TableCell>
              {/* <TableCell>
                <Button
                  onClick={() => deleteCourse(course._id)} // Call deleteCourse function
                  variant="contained"
                  color="secondary" // Color change to signify delete action
                  size="small"
                >
                  Delete
                </Button>
              </TableCell> */}
              <TableCell>
                <Button
                  onClick={() => toggleListStatus(course._id, course.isListed || false)}
                  variant="contained"
                  sx={{ bgcolor: course.isListed ? 'red' : 'green' }} // Color change based on status
                  size="small"
                >
                  {course.isListed ? 'Unlist' : 'List'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DarkThemeTable;
