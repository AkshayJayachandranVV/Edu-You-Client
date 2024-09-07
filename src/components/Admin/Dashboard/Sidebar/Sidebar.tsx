import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard, LibraryBooks, ReportProblem, AttachMoney, People, Person, ExitToApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 250;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#000000', // Set background color to black
    color: 'white',
  },
}));

const AdminSidebar = () => {
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
          { text: 'Dashboard', icon: <Dashboard style={{ color: '#43b27f' }} /> },
          { text: 'Courses', icon: <LibraryBooks style={{ color: '#43b27f' }} /> },
          { text: 'Reported Courses', icon: <ReportProblem style={{ color: '#43b27f' }} /> },
          { text: 'Payouts', icon: <AttachMoney style={{ color: '#43b27f' }} /> },
          { text: 'Students', icon: <People style={{ color: '#43b27f' }} /> },
          { text: 'Tutors', icon: <Person style={{ color: '#43b27f' }} /> },
          { text: 'Sign Out', icon: <ExitToApp style={{ color: '#43b27f' }} /> },
        ].map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default AdminSidebar;
