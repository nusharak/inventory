import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ProductsIcon from '@mui/icons-material/ShoppingCart';
import CustomersIcon from '@mui/icons-material/People';
import OrdersIcon from '@mui/icons-material/ShoppingBag';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is mobile

  const drawerContent = (
    <List>
       <ListItem button component="a" href="/dashboard">
        <OrdersIcon sx={{ mr: 2 }} />
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component="a" href="/products">
        <ProductsIcon sx={{ mr: 2 }} />
        <ListItemText primary="Products" />
      </ListItem>
      <ListItem button component="a" href="/customers">
        <CustomersIcon sx={{ mr: 2 }} />
        <ListItemText primary="Customers" />
      </ListItem>
      <ListItem button component="a" href="/orders">
        <OrdersIcon sx={{ mr: 2 }} />
        <ListItemText primary="Orders" />
      </ListItem>
    </List>
  );

  return (
    <>
      {/* Persistent Drawer for Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Temporary Drawer for Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better performance on mobile
          sx={{
            display: { xs: 'block', sm: 'none' },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              height: '100vh', // Full height for mobile
              boxSizing: 'border-box',
            },
            zIndex: theme.zIndex.drawer + 1, // Ensure it's above the navbar
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
