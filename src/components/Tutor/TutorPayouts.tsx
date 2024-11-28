import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

// Define the Order interface
interface Order {
  _id: string;
  title: string;
  thumbnail: string;
  category: string;
  coursePrice: number;
  tutorShare: number;
  discountPrice: number;
  createdAt: string;
  isListed?: boolean;
  courseLvele:string
}


const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#333",
    color: "#FFB74D",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "18px 10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "1rem",
    color: "#E0E0E0",
    padding: "18px 10px",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#2A2833",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#3C3947",
  },
  "&:hover": {
    backgroundColor: "#4E4958",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface DarkThemeTableProps {
  payoutsData: Order[];
}
const DarkThemeTable: React.FC<DarkThemeTableProps> = ({ payoutsData }) => {
  const [tableData, setTableData] = React.useState<Order[]>(payoutsData);

  React.useEffect(() => {
    if (Array.isArray(payoutsData)) {
      console.log("Order data received:", payoutsData);
      setTableData(payoutsData);
    } else {
      console.error("Received data is not an array:", payoutsData);
    }
  }, [payoutsData]);

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ color: "#FFC107", fontWeight: "bold" }} // Increase font width
      >
        Tutor Payouts
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#29262E",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginTop: "24px",
          maxWidth: "95%", // Increase width of table
          margin: "auto", // Center the table
        }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">SI No</StyledTableCell>
              <StyledTableCell align="left">Course</StyledTableCell>
              <StyledTableCell align="center">Thumbnail</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Course Price</StyledTableCell>
              <StyledTableCell align="center">Payment</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(tableData) && tableData.length > 0 ? (
              tableData.map((course, index) => (
                <StyledTableRow key={course._id} sx={{ height: "80px" }}>
                  <StyledTableCell align="center" component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="left">{course.title}</StyledTableCell>
                  <StyledTableCell align="center">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: "80px", // Increase image width
                        height: "60px", // Increase image height
                        borderRadius: "5px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {course.category}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    ${course.discountPrice}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    ${course.tutorShare}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(course.createdAt).toLocaleString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={10} align="center">
                  No courses available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DarkThemeTable;
