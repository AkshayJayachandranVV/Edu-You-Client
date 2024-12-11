import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

// Define the shape of the course report data
interface CourseData {
  courseName: string;
  thumbnail: string;
  userId: string;
  userName: string;
  tutorName: string;
  tutorShare: number;  // Change this to 'number' to match AdminPayoutPage
  createdAt: string;
  adminShare: number;
  discountPrice: number;
  courseId: string;
  title:string;
}


// Use props to accept coursesData
interface CoursesProps {
  data: {
    initialCoursesData: CourseData[];
    currentPage: number;
    itemsPerPage: number;
  };
}

const ReportCourses: React.FC<CoursesProps> = ({ data }) => {
  const { initialCoursesData, currentPage, itemsPerPage } = data;
  const [coursesData] = React.useState<CourseData[]>(
    initialCoursesData
  );

  return (
    <Grid container justifyContent="center" sx={{ p: 2 }}>
      <Grid item xs={12} md={10}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            bgcolor: "#1b2532",
            overflowX: "auto", // Enable horizontal scrolling
            maxWidth: "100%",
          }}
        >
          <Table
            sx={{
              "& tbody": {
                color: "#fff",
              },
              "& thead": {
                bgcolor: "#1e1f22", // Set a different color for the header background
              },
              "& th": {
                color: "#fff", // Set the text color for the header cells
                padding: "16px",
                borderColor: "#1b2532",
              },
              "& td": {
                borderColor: "#1b2532",
                color: "#fff",
                padding: "16px",
              },
              width: "100%", // Ensure the table takes the full width
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  SI No
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  User Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Tutor Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Course Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Thumbnail
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Discount Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Tutor Share
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Admin Share
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coursesData.map((course, index) => {
                const serialNumber =
                  (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <TableRow
                    key={course.courseId}
                    sx={{
                      bgcolor: "#1b2532", // Apply the same color for all rows
                      borderBottom: "2px solid #333", // Add a border line after each row
                    }}
                  >
                    <TableCell>{serialNumber}</TableCell>
                    <TableCell>{course.userName || "N/A"}</TableCell>
                    <TableCell>{course.tutorName || "N/A"}</TableCell>
                    <TableCell>{course.title || "N/A"}</TableCell>
                    <TableCell>
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt="Course Thumbnail"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>
                      {course.createdAt
                        ? new Date(course.createdAt).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{course.discountPrice || "N/A"}</TableCell>
                    <TableCell>{course.tutorShare || "N/A"}</TableCell>
                    <TableCell>{course.adminShare || "N/A"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ReportCourses;
