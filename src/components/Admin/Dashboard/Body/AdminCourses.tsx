import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
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
  data: {
    initialCoursesData: Course[];
    currentPage: number;
    itemsPerPage: number;
  };
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
      const response = await axiosInstance.get(`${adminEndpoints.listUnlist.replace("courseId", courseId)}`);


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
        bgcolor: "#1b2532",
        overflowX: "auto", // Allow horizontal scroll on small screens
      }}
    >
      <Table sx={{ "& tbody": { color: "#fff" }, "& th, & td": { color: "#fff", borderColor: "#1b2532" ,padding: "16px",  } }}>
        <TableHead>
          <TableRow>
            <TableCell className="text-sm sm:text-base">SI No</TableCell>
            <TableCell className="text-sm sm:text-base">Course Name</TableCell>
            <TableCell className="text-sm sm:text-base">Thumbnail</TableCell>
            <TableCell className="text-sm sm:text-base">Category</TableCell>
            <TableCell className="text-sm sm:text-base">Level</TableCell>
            <TableCell className="text-sm sm:text-base">Price</TableCell>
            <TableCell className="text-sm sm:text-base">Discount Price</TableCell>
            <TableCell className="text-sm sm:text-base">Date</TableCell>
            <TableCell className="text-sm sm:text-base">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coursesData.map((course, index) => {
            const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <TableRow key={course._id} sx={{ bgcolor: index % 2 === 0 ? "#1b2532" : "#1e1f22" }}>
                <TableCell>{serialNumber}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>
                  <img src={course.thumbnail} alt={course.courseName} className="w-12 h-auto" />
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
                    sx={{ bgcolor: course.isListed ? "red" : "green" }}
                    size="small"
                  >
                    {course.isListed ? "Unlist" : "List"}
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
