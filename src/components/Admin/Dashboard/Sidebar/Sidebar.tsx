import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard, LibraryBooks, ReportProblem, AttachMoney, People, Person, ExitToApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const drawerWidth = 250;

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#000000', // Set background color to black
    color: 'white',
  },
}));

const AdminSidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle navigation when a menu item is clicked
  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified route
  };

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
      sx={{ display: { xs: 'none', sm: 'block' } }}
    >
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2d3a4e' }}>
        <IconButton edge="start">
          <MenuIcon style={{ color: '#43b27f' }} /> {/* Icon color #43b27f */}
        </IconButton>
        <Typography variant="h6" style={{ color: 'white', marginLeft: '16px' }}>
          Admin
        </Typography>
      </div>
      <List>
        {[
          { text: 'Dashboard', icon: <Dashboard style={{ color: '#43b27f' }} />, path: '/admin/dashboard' },
          { text: 'Courses', icon: <LibraryBooks style={{ color: '#43b27f' }} />, path: '/admin/courses' },
          { text: 'Reported Courses', icon: <ReportProblem style={{ color: '#43b27f' }} />, path: '/admin/reports' },
          { text: 'Payouts', icon: <AttachMoney style={{ color: '#43b27f' }} />, path: '/admin/payouts' },
          { text: 'Students', icon: <People style={{ color: '#43b27f' }} />, path: '/admin/students' },
          { text: 'Tutors', icon: <Person style={{ color: '#43b27f' }} />, path: '/admin/tutors' },
          { text: 'Sign Out', icon: <ExitToApp style={{ color: '#43b27f' }} />, path: '/admin/sign-out' },
        ].map((item, index) => (
          <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default AdminSidebar;
