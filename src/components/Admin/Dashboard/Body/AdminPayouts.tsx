import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

// Define the shape of the course report data
interface FormattedCourseReport {
  courseId: string;
  courseName: string;
  thumbnail: string;
  userId: string;
  userName: string;
  tutorName: string;
  tutorShare: string;
  createdAt: string;
  adminShare: number;
  discountPrice: string;
}

// Use props to accept coursesData
interface ReportCoursesProps {
  initialCoursesData: FormattedCourseReport[];
  currentPage: number;
  itemsPerPage: number;
}

const ReportCourses: React.FC<ReportCoursesProps> = ({
data
}) => {
  const { initialCoursesData, currentPage, itemsPerPage } = data;
  const [coursesData, setCoursesData] =
    React.useState<FormattedCourseReport[]>(initialCoursesData);

  console.log("initial data:", initialCoursesData);

  return (
    <Grid container justifyContent="center" sx={{ p: 2 }}>
      <Grid item xs={12} md={10}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "sm",
            bgcolor: "#1b2532",
            overflowX: "auto",
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
                padding: "24px",
                borderColor: "#1b2532",
              },
              "& td": {
                borderColor: "#1b2532",
                color: "#fff",
                padding: "24px",
              },
              width: "100%",
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
              {coursesData.map((report, index) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <TableRow
                    key={report.courseId}
                    sx={{
                      bgcolor: "#1b2532", // Apply the same color for all rows
                      borderBottom: "2px solid #333", // Add a border line after each row
                    }}
                  >
                    <TableCell>{serialNumber}</TableCell>
                    <TableCell>{report.userName}</TableCell>
                    <TableCell>{report.tutorName}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>
                      <img
                        src={report.thumbnail}
                        alt="Course Thumbnail"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{report.discountPrice}</TableCell>
                    <TableCell>{report.tutorShare}</TableCell>
                    <TableCell>{report.adminShare}</TableCell>
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
