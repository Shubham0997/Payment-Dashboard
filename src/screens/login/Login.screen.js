import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { loginContext } from "../../App";
import "./login.styles.css";
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

//login page
const Login = () => {
  useEffect(() => {
    document.title = "GreenDot - Login";
  }, []);

  const [username, setUsername] = useState(""); //username state variable
  const [password, setPassword] = useState(""); //password state variable

  const [credentialMessageHandler, setcredentialMessageHandler] = useState(""); //invalid credential message state variable

  const navigate = useNavigate();

  const { dispatch } = useContext(loginContext); //login context variable

  //method to handle the inputs i.e username and passwords if the username is entered, it will be stored/assigned to the username state variable , if the password is entered, it will be stored/assigned to the password state variable
  const inputHandler = (event) => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  // method to validate the credentials from database using the api
  const checkCredentials = (event) => {
    event.preventDefault();

    //if the username and the password aren't entered and the login button is clicked
    if (username === "" || password === "") {
      setcredentialMessageHandler("Please enter your credentials");
      return;
    }

    //checking credentials
    axios
      .post("http://localhost:3300/login/", {
        username,
        password,
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === "Invalid Username/password") {
          //if the entered credentials are invalid, message will be set to invalid credentials
          setcredentialMessageHandler("Invalid Credentials");
        } else {
          //if the credentials are valid, set the sessionStorage variables and redirect to the dashboard

          dispatch({
            type: "LOGIN",
            payload: { username: username },
          });
          sessionStorage.setItem("activeUsername", username);
          sessionStorage.setItem("isLoggedIn", true);
          sessionStorage.setItem("accessToken", response.data.token);
          sessionStorage.setItem("refreshToken", response.data.refreshtoken);
          sessionStorage.setItem("userType", response.data.userType);
          sessionStorage.setItem("userId", response.data.userId);
          if(response.data.userType === "admin" || response.data.userType === "biller"){
          navigate("/dashboard");
          }
          else {
          navigate("/home");
          }
        }
      });
  };

  const bgStyle = { padding: 0 };
  const paperStyle = {
    padding: 20,
    height: "50vh",
    width: 280,
    margin: "10% auto",
    borderRadius: "1.5rem",
  };
  const avatarStyle = { backgroundColor: "#357cc1 " };
  const textFieldStyle = { margin: "15px auto", borderRadius: "1rem" };
  const buttonStyle = {
    margin: "40px auto",
    borderRadius: "1rem",
    backgroundColor: "#357cc1",
  };
  return (
    <>
      <Grid id="main-container-loginpage" style={bgStyle}>
        <Paper id="loginBox" elevation={10} style={paperStyle}>
          <Grid align="center">
            <h2 id="companyLogo"> Paymentus </h2>{" "}
            <Avatar style={avatarStyle}>
              {" "}
              <LockRoundedIcon />{" "}
            </Avatar>{" "}
          </Grid>{" "}
          <form onSubmit={checkCredentials}>
            <TextField
              className="standard-basic"
              style={textFieldStyle}
              label="Username"
              variant="standard"
              fullWidth
              required={true}
              value={username}
              onChange={inputHandler}
              placeholder="Username"
              name="username"
            />
            <TextField
              className="standard-basic"
              style={textFieldStyle}
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              required={true}
              value={password}
              onChange={inputHandler}
              placeholder="Password"
              name="password"
            />
            <div className="errorMSG"> {credentialMessageHandler} </div>{" "}
            <Button
              type="submit"
              value="Submit"
              variant="contained"
              size="medium"
              fullWidth
              style={buttonStyle}
            >
              {" "}
              Login{" "}
            </Button>{" "}
          </form>{" "}
        </Paper>{" "}
      </Grid>
    </>
  );
};
export default Login;
