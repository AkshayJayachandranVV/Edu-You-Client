import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Book, People, AttachMoney, AccountCircle, Security, ExitToApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 250;

const PersistentDrawer = styled(Drawer)(({ theme }) => ({
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

  const handleDrawerToggle = () => {
    setOpen(!open);
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
          { text: 'Dashboard', icon: <Dashboard style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
          { text: 'My Courses', icon: <Book style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
          { text: 'Students', icon: <People style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
          { text: 'Payouts', icon: <AttachMoney style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
          { text: 'Profile', icon: <AccountCircle style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
          { text: 'Privacy and Security', icon: <Security style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
          { text: 'Sign out', icon: <ExitToApp style={{ color: '#5f71ea', fontSize: '2rem' }} /> },
        ].map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>
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
