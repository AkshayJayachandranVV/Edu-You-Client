import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Book, People, AttachMoney, AccountCircle, Security, ExitToApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const drawerWidth = 250;

const PersistentDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#1b2532',
    color: 'white',
    height: '100vh', // Full viewport height
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard'); // State to track active item
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Handle sidebar item click
  const handleItemClick = (text: string, route: string) => {
    setActiveItem(text); // Update active item
    navigate(route); // Navigate to the route
  };

  const drawerContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2d3a4e' }}>
        <IconButton edge="start">
          <MenuIcon style={{ color: '#5f71ea', fontSize: '2rem' }} />
        </IconButton>
        <Typography variant="h6" style={{ color: 'white', marginLeft: '16px', fontSize: '1.5rem' }}>
          Tutor
        </Typography>
      </div>
      <List>
        {[
          { text: 'Dashboard', icon: <Dashboard style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/dashboard' },
          { text: 'My Courses', icon: <Book style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/courses' },
          { text: 'Students', icon: <People style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/students' },
          { text: 'Payouts', icon: <AttachMoney style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/payouts' },
          { text: 'Profile', icon: <AccountCircle style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/profile' },
          { text: 'Privacy and Security', icon: <Security style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/privacy' },
          { text: 'Sign out', icon: <ExitToApp style={{ color: '#5f71ea', fontSize: '2rem' }} />, route: '/tutor/signout' },
        ].map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleItemClick(item.text, item.route)} // Handle click
            style={{
              backgroundColor: activeItem === item.text ? '#5f71ea' : 'inherit', // Highlight active item
              color: activeItem === item.text ? 'white' : 'inherit', // Change text color of active item
            }}
          >
            <ListItemIcon style={{ color: activeItem === item.text ? 'white' : '#5f71ea' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontSize: '1.25rem' } }} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <PersistentDrawer
      variant="persistent"
      anchor="left"
      open={!isMobile || open}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {drawerContent}
    </PersistentDrawer>
  );
};

export default Sidebar;
