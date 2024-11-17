import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";

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

const DarkThemeTable: React.FC<DarkThemeTableProps> = ({ data }) => {
  const { initialCoursesData, currentPage, itemsPerPage } = data;
  console.log("got"); // This will now log the correct data
  const [coursesData, setCoursesData] =
    React.useState<Course[]>(initialCoursesData);

  // Function to toggle list/unlist status
  const toggleListStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      console.log(courseId, "=---------courseid");
      const response = await axiosInstance.post(adminEndpoints.listCourse, {
        courseId,
      });

      console.log("Toggling list/unlist status:", response);

      // Update course data locally
      const updatedCourses = coursesData.map((course) =>
        course._id === courseId
          ? { ...course, isListed: !currentStatus }
          : course
      );
      setCoursesData(updatedCourses);
    } catch (error) {
      console.error("Error toggling list/unlist status:", error);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "sm",
        bgcolor: "#1b2532", // Dark background for the table container
      }}
    >
      <Table
        sx={{
          "& tbody": {
            color: "#fff", // Text color for table rows
          },
          "& thead": {
            bgcolor: "#1b2532", // Dark background for table headers
            color: "#fff", // Text color for table headers
          },
          "& th, & td": {
            borderColor: "#1b2532", // Border color
            color: "#fff", // Text color for cells
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
  {coursesData.map((course, index) => {
    const serialNumber = (currentPage - 1) * itemsPerPage + index + 1; // Calculate the serial number
    return (
      <TableRow
        key={course._id}
        sx={{
          bgcolor: index % 2 === 0 ? '#1b2532' : '#1e1f22', // Alternate row colors
        }}
      >
        <TableCell>{serialNumber}</TableCell> {/* Display serial number */}
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
    );
  })}
</TableBody>

      </Table>
    </TableContainer>
  );
};

export default DarkThemeTable;
