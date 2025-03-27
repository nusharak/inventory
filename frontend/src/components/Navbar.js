import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ handleDrawerToggle }) => {
   const navigate = useNavigate();
  
    // Handle the button click to navigate to the products page
    const handleClick = () => {
      navigate("/");
      window.location.reload()
    };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap onClick={handleClick} style={{ cursor: 'pointer' }}>
          Our Store
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
