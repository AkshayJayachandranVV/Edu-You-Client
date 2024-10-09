import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Book, People, AttachMoney, AccountCircle, Security, ExitToApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
  const [open, setOpen] = useState(!isMobile); // Set initial state based on screen size
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open); // Toggle open/close state
  };

  const handleItemClick = (text: string, route: string) => {
    setActiveItem(text);
    console.log("Navigating to:", route); // To check if the click works
    navigate(route); // Navigate to the specified route
    if (isMobile) setOpen(false); // Close drawer on mobile after clicking
  };

  const drawerContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2d3a4e' }}>
        <IconButton edge="start" onClick={handleDrawerToggle}>
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
    <>
      <IconButton onClick={handleDrawerToggle} style={{ color: 'white', position: 'absolute', top: 10, left: 10 }}>
        <MenuIcon style={{ fontSize: '2rem' }} />
      </IconButton>

      <PersistentDrawer
        variant={isMobile ? 'temporary' : 'persistent'} // Use 'temporary' drawer on mobile, 'persistent' on desktop
        anchor="left"
        open={open}
        onClose={handleDrawerToggle} // Close the drawer on mobile
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'block' }, // Ensure drawer is always visible on small and large screens
        }}
      >
        {drawerContent}
      </PersistentDrawer>
    </>
  );
};

export default Sidebar;
