import * as React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, Button } from "@mui/material";
import axiosInstance from "../../../src/components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../src/components/constraints/endpoints/TutorEndpoints";

// Define the Course interface
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1F1B24",
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontSize: "1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#E0E0E0",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#2D2A35",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#3B3742",
  },
  "&:hover": {
    backgroundColor: "#4B4556",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface DarkThemeTableProps {
  courseData: Course[];
  startingIndex: number; // Prop for serial number offset
}

export default function DarkThemeTable({ courseData, startingIndex }: DarkThemeTableProps) {
  const [coursesData, setCourseData] = React.useState<Course[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (Array.isArray(courseData)) {
      console.log(courseData, "got it  --- in the courseData");
      setCourseData(courseData);
    } else {
      console.error("courseData is not an array:", courseData);
    }
  }, [courseData]);

  const listCourse = async (courseId: string) => {
    try {
      const list = await axiosInstance.get(
        `${tutorEndpoints.listCourse.replace("courseId", courseId)}`
      );
      console.log(list, "got the response");

      setCourseData((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, isListed: !course.isListed }
            : course
        )
      );
    } catch (error) {
      console.error("Error listing/unlisting course", error);
    }
  };

  const viewCourse = async (courseId: string) => {
    navigate(`/tutor/courseView/${courseId}`);
  };

  const editCourse = async (courseId: string) => {
    navigate(`/tutor/editCourse/${courseId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#FFC107" }}>
        Tutor Courses
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#29262E",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>SI No</StyledTableCell>
              <StyledTableCell align="right">Course</StyledTableCell>
              <StyledTableCell align="right">Thumbnail</StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
              <StyledTableCell align="right">Level</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Discount Price</StyledTableCell>
              <StyledTableCell align="right">Date</StyledTableCell>
              <StyledTableCell align="right">View</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              <StyledTableCell align="right">List/Unlist</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(coursesData) && coursesData.length > 0 ? (
              coursesData.map((course, index) => (
                <StyledTableRow key={course._id}>
                  <StyledTableCell component="th" scope="row">
                    {startingIndex + index}
                  </StyledTableCell>
                  <StyledTableCell align="right">{course.courseName}</StyledTableCell>
                  <StyledTableCell align="right">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      style={{ width: "50px", height: "auto" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">{course.courseCategory}</StyledTableCell>
                  <StyledTableCell align="right">{course.courseLevel}</StyledTableCell>
                  <StyledTableCell align="right">{course.coursePrice}</StyledTableCell>
                  <StyledTableCell align="right">{course.courseDiscountPrice}</StyledTableCell>
                  <StyledTableCell align="right">
                    {new Date(course.createdAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      onClick={() => viewCourse(course._id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      View
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      onClick={() => editCourse(course._id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Edit
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      onClick={() => listCourse(course._id)}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      {course.isListed ? "Unlist" : "List"}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={9} align="center">
                  No courses available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
