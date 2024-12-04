import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import axiosInstance from "../../../constraints/axios/adminAxios";

// Define the shape of the user data
interface FormattedTutors {
  sino: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

interface AdminTutorsProps {
  tutorsData: FormattedTutors[];
}

const AdminTutors: React.FC<AdminTutorsProps> = ({
  tutorsData: initialTutorsData,
}) => {
  // Manage the state for the students data
  const [tutorsData, setTutorsData] =
    React.useState<FormattedTutors[]>(initialTutorsData);

  // Function to toggle block/unblock status
  const toggleBlockStatus = async (email: string, currentStatus: boolean) => {
    try {
      const data = { email: email };
      console.log("Toggling block status for:", data);

      // Make the request to the backend to update the status
      const result = await axiosInstance.post(
        adminEndpoints.tutorIsBlocked,
        data
      );
      console.log(result);

      // Optimistically update the UI by toggling the block status in the local state
      const updatedTutors = tutorsData.map((tutor) =>
        tutor.email === email ? { ...tutor, isBlocked: !currentStatus } : tutor
      );
      setTutorsData(updatedTutors);
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "sm",
        bgcolor: "#1b2532", 
      }}
    >
      <Table
        sx={{
          "& tbody": {
            color: "#fff", 
          },
          "& thead": {
            bgcolor: "#1b2532", // Header background color
            color: "#fff", 
          },
          "& th, & td": {
            borderColor: "#1b2532", // Border color
            color: "#fff", // Cell text color
            padding: "16px", // Increase padding for cell height
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>SINO</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone No</TableCell>
            <TableCell>check</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tutorsData.map((tutor, index) => {
            console.log(`User: ${tutor.name}, isBlocked: ${tutor.isBlocked}`);

            return (
              <TableRow
                key={tutor.sino}
                sx={{
                  bgcolor: index % 2 === 0 ? "#1b2532" : "#1e1f22", // Even rows get #1b2532, odd rows get #1e1f22
                  height: 80, // Set a custom row height
                }}
              >
                <TableCell>{tutor.sino}</TableCell>
                <TableCell>
                  {tutor.image ? (
                    <img
                      src={tutor.image}
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
                <TableCell>{tutor.name}</TableCell>
                <TableCell>{tutor.email}</TableCell>
                <TableCell>{tutor.phone}</TableCell>
                <TableCell>{tutor.isBlocked ? "Blocked" : "Active"}</TableCell>
                <TableCell>
                  {tutor.isBlocked ? (
                    <Button
                      onClick={() =>
                        toggleBlockStatus(tutor.email, tutor.isBlocked)
                      }
                      variant="contained"
                      sx={{ bgcolor: "green" }} 
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        toggleBlockStatus(tutor.email, tutor.isBlocked)
                      }
                      variant="contained"
                      sx={{ bgcolor: "red" }} 
                    >
                      Block
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminTutors;
