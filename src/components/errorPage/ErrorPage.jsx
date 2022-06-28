import { Paper,Grid } from "@mui/material";
import React from "react";
import "./errorPage.styles.css"

//Error page contains the static data that'll be shown to the user if they try to access restricted URLs like dashboard without logging in.
const ErrorPage = () => {
const paperStyle = {
    padding: 20,
    height: "50vh",
    width: "70%",
    margin: "10% auto",
    borderRadius: "1.5rem",
    
    };
return (
    <>
    <div className="topbarNav">
    <div className="topbarWrapper">
            <div className="topLeft">
                <span className="logo">Paymentus</span></div></div></div>
                <Paper id="loginBox" elevation={10} style={paperStyle}>
        <Grid align="center"><h2 id="warningHeader" color="red" alignItem="center"><strong>The requested URL was not found on this server.</strong></h2>
        </Grid><div id="warningDescription"><ul><li className="errorLines"><p>you might have been logged out, please try logging in again.</p></li>
        <li  className="errorLines"><p>if you entered the URL manually please check your spellings.</p></li>
        <li  className="errorLines"><p>if you think this is a server error, please contact the Administrator.</p></li></ul></div> </Paper>{" "}
            
    </>
)
}
export default ErrorPage;