import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Book, People, AttachMoney, AccountCircle, Security, ExitToApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 250;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#1b2532',
    color: 'white',
    borderRight: '1px solid #2d3a4e',
  },
}));

const SidebarHeader = styled('div')({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid #2d3a4e',
  backgroundColor: '#2d3a4e',
});

const SidebarItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: '24px',
  paddingRight: '24px',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#2d3a4e',
  },
}));

const SidebarIcon = styled(ListItemIcon)({
  minWidth: '40px',
  color: '#5f71ea',
});

const SidebarText = styled(ListItemText)({
  '& .MuiTypography-root': {
    fontSize: '1.25rem',
  },
});

const Sidebar = () => {
  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
      sx={{ display: { xs: 'none', sm: 'block' } }}
    >
      <SidebarHeader>
        <IconButton edge="start">
          <MenuIcon style={{ color: '#5f71ea', fontSize: '2rem' }} /> {/* Increased icon size */}
        </IconButton>
        <Typography variant="h6" style={{ color: 'white', marginLeft: '16px', fontSize: '1.5rem' }}> {/* Increased text size */}
          Tutor
        </Typography>
      </SidebarHeader>
      <List>
        {[
          { text: 'Dashboard', icon: <Dashboard /> },
          { text: 'My Courses', icon: <Book /> },
          { text: 'Students', icon: <People /> },
          { text: 'Payouts', icon: <AttachMoney /> },
          { text: 'Profile', icon: <AccountCircle /> },
          { text: 'Privacy and Security', icon: <Security /> },
          { text: 'Sign out', icon: <ExitToApp /> },
        ].map((item, index) => (
          <SidebarItemButton key={index}>
            <SidebarIcon>
              {item.icon}
            </SidebarIcon>
            <SidebarText primary={item.text} />
          </SidebarItemButton>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
