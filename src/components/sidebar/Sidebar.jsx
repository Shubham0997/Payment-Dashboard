import React, { useContext } from 'react';
import {  useNavigate } from 'react-router-dom';
import { loginContext } from "../../App";
import { Dashboard, Home, Logout} from '@mui/icons-material';
import { Footer } from '../../components';
import { Box,List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';


//Sidebar being used as navigation bar
const Sidebar = () => {

const navigate = useNavigate();
const {loginState, dispatch} = useContext(loginContext); // login context variable to keep track of session

//logout function which will logout the user and remove the session variables
const handleLogout = () => {
  dispatch({type: 'LOGOUT'});
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('activeUsername');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  navigate('/'); //navigate back to login page
};
const iconStyle={minWidth:"30px"}
return (
    <>
        {loginState.isLoggedIn ? (
            <Box className='sidebr' bgcolor="aliceblue"  p={4} minHeight={"100%"} sx={{flex:{xs:"1",sm:"1",md:"1",lg:"1"}}}>
                <Box position="fixed" left={0}>
        <List>
        <ListItem disablePadding>
        <ListItemButton component="a" to="/home">
          <ListItemIcon style={iconStyle}>
          <Home  color='primary' fontSize="large"/>
          </ListItemIcon>
          <ListItemText primary="Home"  sx={{display:{xs:"none",sm:"none",md:"block",lg:"block"}}}/>
        </ListItemButton>
      </ListItem>
      { sessionStorage.getItem("userType") !== "visitor"  ?
      (<ListItem disablePadding>
        <ListItemButton component="a" to="/dashboard">
          <ListItemIcon  style={iconStyle}>
          <Dashboard color='primary' fontSize="large" /> </ListItemIcon>
          <ListItemText primary="Find Payment" sx={{display:{xs:"none",sm:"none",md:"block",lg:"block"}}} />
        </ListItemButton>
      </ListItem>) : (<></>)
      }
      
      <ListItem disablePadding sx={{display:{xs:"block",sm:"none",md:"none",lg:"none"}}}>
        <ListItemButton component="a" onClick={handleLogout}>
          <ListItemIcon  style={iconStyle}>
          <Logout  color='primary' fontSize='large' /> </ListItemIcon>
        </ListItemButton>
      </ListItem>

            
        </List>
        </Box>
        </Box>
        ) : (<div><h1>You are not logged in</h1><Footer/></div>)
        }
    </>
);
};

export default Sidebar;