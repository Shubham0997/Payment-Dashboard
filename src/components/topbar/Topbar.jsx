import React from "react";
import { loginContext } from "../../App";
import  { useContext} from 'react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer'

import { TimeoutModal } from '../timeout-modal';
import { Footer } from '../../components';

import { Logout} from '@mui/icons-material';
import { AppBar, Button, Stack } from '@mui/material';

const IDLE_TIME = 600000; // idle time variable of 10 minutes
const LOGOUT_TIME = 300000; // logout time variable of 5 minutes to logout after 5 minutes of modal popup if no option picked
const REFRESH_API_TOKEN = 600000; //refresh token time variable of 10 minutes to get the new refresh token
let logoutTimerId = undefined;

//topbar to show the paymentus logo and user name. 
//Also includes the functionality of logout and user inactivity timeout
const Topbar = () => {


const {loginState, dispatch} = useContext(loginContext); //login context variable
const navigate = useNavigate();
const [showModal, setShowModal] = useState(false); // state variable for timeout modal, if value= true, popup modal will open up

//function to fetch the new access token and refresh token upon page refresh.
useEffect(() => {
    const refreshtoken = sessionStorage.getItem("refreshToken"); //getting the refresh token, stored as session varibale, as its required to get the new refresh token and access token
    
        //object for fetch request body
        const refreshObject = {
            "refreshtoken":refreshtoken
        }

        //function to get the new refresh token upon page refresh
        const refreshTheToken = async () =>{

            //object of data to be sent with the api
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(refreshObject)
            };
            

            const request = fetch('http://localhost:3300/login/refresh-token', requestOptions);
            const response = await request;
            const data = await response.json(); //storing the data from result of API as a json object
            
            sessionStorage.setItem("accessToken", data.token); //updating the accessToken 
            sessionStorage.setItem("refreshToken", data.refreshtoken); //updating the refresh token 
        }
        refreshTheToken();
}, []);



useEffect(() => {

    //function to get the new refresh token after refresh token timeout i.e 10 minutes
    const refreshTokenTimerId = setInterval(() => {
        const refreshtoken = sessionStorage.getItem("refreshToken");
        const refreshObject = {
            "refreshtoken":refreshtoken
        }
        const refreshTheToken = async () =>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(refreshObject)
        };
        
        const request = fetch('http://localhost:3300/login/refresh-token', requestOptions);
        const response = await request;
        const data = await response.json();
    
        sessionStorage.setItem("accessToken", data.token);
        sessionStorage.setItem("refreshToken", data.refreshtoken);

        }
        refreshTheToken();

    }, REFRESH_API_TOKEN);

    return () => {
        clearInterval(refreshTokenTimerId);
    }
}, []);


//logout function which will logout the user and remove the session variables
const handleLogout = () => {
    dispatch({type: 'LOGOUT'});
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('activeUsername');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    navigate('/'); //navigate back to login page
};

//function to show the timeout modal after 10 minutes and logout 5 minutes later .
const onIdle = () => {
    setShowModal(true); //opening up timeout modal
    logoutTimerId = setTimeout(() => {
        setShowModal(false);
        handleLogout(); //logging out 5 minutes later
    }, LOGOUT_TIME);
};

const {start, reset} = useIdleTimer({ onIdle, timeout: IDLE_TIME, stopOnIdle: true });

useEffect(() => {
    start();
    // eslint-disable-next-line
}, []);

//handling the "Stay logged in" button after user click the button to stay logged in
const handleShowModal = () => {
    if (logoutTimerId) {
        clearTimeout(logoutTimerId);
        logoutTimerId = undefined;
    }
    setShowModal(false);
    reset();
};

const topbarIconStyles={marginInline:"0.6rem"}
const buttonStyle = {marginLeft:"1vw",marginRight:"1vw",marginTop: 0,borderRadius: "1rem", backgroundColor: "#357cc1" }

return (
    <>
    {loginState.isLoggedIn ? (
        <AppBar position="sticky" width="100%">
    <div className="topbarNav">                 
    <Stack className="topbarWrapper"  direction="row" spacing={3} p={0}>
            <div className="topLeft" sx={{textAlign:{xs:"center"}}}>
                <span className="logo">Paymentus</span></div>
            <Stack className="topRight"  p={1} style={topbarIconStyles} direction="row" display="flex"  sx={{display:{xs:"none",sm:"block"}}} >
                
                <Stack className="topbarIconContainer" p={1} style={topbarIconStyles} direction="row" display="flex" flexDirection="row" spacing={1} justifyContent="space-between" sx={{display:{xs:"none",sm:"block"}}}>
                <Button id="logOut" flex={1}onClick={handleLogout} variant="contained" fontSize="large" fullWidth style={buttonStyle}><Logout/>Logout</Button>
                <TimeoutModal show={showModal} toShowModal={handleShowModal} toLogOut={handleLogout}/>


                </Stack>
            </Stack>


        </Stack>
        </div> </AppBar>) : (<div><h1>You are not logged in</h1><Footer/></div>)
    }
    </>
)
}
export default Topbar;