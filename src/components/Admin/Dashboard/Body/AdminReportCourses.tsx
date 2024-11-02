import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import axiosInstance from '../../../constraints/axios/adminAxios';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';

// Define the shape of the course report data
interface FormattedCourseReport {
  courseId: string;
  courseName: string;
  thumbnail: string;
  userId: string;
  username: string;
  email: string;
  reason: string;
  description: string;
  createdAt: string;
  isListed: boolean;
}

// Use props to accept coursesData
interface ReportCoursesProps {
  initialCoursesData: FormattedCourseReport[];
}

const ReportCourses: React.FC<ReportCoursesProps> = ({ initialCoursesData }) => {
  // Step 2: Set up state to hold course data
  const [coursesData, setCoursesData] = React.useState<FormattedCourseReport[]>(initialCoursesData);

  // Function to toggle listing status
  const toggleListStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      console.log(courseId, "=---------courseid");
      const response = await axiosInstance.post(adminEndpoints.listCourse, { courseId });

      console.log('Toggling list/unlist status:', response);

      // Step 3: Update course data locally
      const updatedCourses = coursesData.map((course) =>
        course.courseId === courseId ? { ...course, isListed: !currentStatus } : course
      );
      setCoursesData(updatedCourses);
    } catch (error) {
      console.error('Error toggling list/unlist status:', error);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ p: 2 }}>
      <Grid item xs={12} md={10}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 'sm',
            bgcolor: '#1b2532',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          <Table
            sx={{
              '& tbody': {
                color: '#fff',
              },
              '& thead': {
                bgcolor: '#1b2532',
                color: '#fff',
              },
              '& th, & td': {
                borderColor: '#1b2532',
                color: '#fff',
                padding: '24px',
              },
              width: '100%',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Reported At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coursesData.map((report, index) => (
                <TableRow
                  key={report.courseId}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#1b2532' : '#1e1f22',
                  }}
                >
                  <TableCell>{report.courseName}</TableCell>
                  <TableCell>
                    <img
                      src={report.thumbnail}
                      alt="Course Thumbnail"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  </TableCell>
                  <TableCell>{report.username}</TableCell>
                  <TableCell>{report.email}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={report.isListed ? 'secondary' : 'primary'}
                      onClick={() => toggleListStatus(report.courseId, report.isListed)}
                    >
                      {report.isListed ? 'Unlist' : 'List'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ReportCourses;
