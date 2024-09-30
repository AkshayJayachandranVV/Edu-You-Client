import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import axiosInstance from '../../../constraints/axios/adminAxios';

// Define the shape of the user data
interface FormattedStudent {
  sino: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

interface AdminStudentsProps {
  studentsData: FormattedStudent[];
}

const AdminStudents: React.FC<AdminStudentsProps> = ({ studentsData: initialStudentsData }) => {
  // Manage the state for the students data
  const [studentsData, setStudentsData] = React.useState<FormattedStudent[]>(initialStudentsData);

  // Function to toggle block/unblock status
  const toggleBlockStatus = async (email: string, currentStatus: boolean) => {
    try {
      const data = { email: email };
      console.log('Toggling block status for:', data);

      // Make the request to the backend to update the status
      const result = await axiosInstance.post(adminEndpoints.isBlocked, data);
      console.log(result);

      // Optimistically update the UI by toggling the block status in the local state
      const updatedStudents = studentsData.map((student) =>
        student.email === email ? { ...student, isBlocked: !currentStatus } : student
      );
      setStudentsData(updatedStudents);
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 'sm',
        bgcolor: '#1b2532', // Background color for the container
      }}
    >
      <Table
        sx={{
          '& tbody': {
            color: '#fff', // Text color for rows
          },
          '& thead': {
            bgcolor: '#1b2532', // Header background color
            color: '#fff', // Header text color
          },
          '& th, & td': {
            borderColor: '#1b2532', // Border color
            color: '#fff', // Cell text color
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
          {studentsData.map((user, index) => {
            console.log(`User: ${user.name}, isBlocked: ${user.isBlocked}`);

            return (
              <TableRow
                key={user.sino}
                sx={{
                  bgcolor: index % 2 === 0 ? '#1b2532' : '#1e1f22', // Even rows get #1b2532, odd rows get #1e1f22
                }}
              >
                <TableCell>{user.sino}</TableCell>
                <TableCell>{user.image}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  {user.isBlocked ? (
                    <Button
                      onClick={() => toggleBlockStatus(user.email, user.isBlocked)}
                      variant="contained"
                      sx={{ bgcolor: 'green' }} // Unblock button color
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      onClick={() => toggleBlockStatus(user.email, user.isBlocked)}
                      variant="contained"
                      sx={{ bgcolor: 'red' }} // Block button color
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

export default AdminStudents;
