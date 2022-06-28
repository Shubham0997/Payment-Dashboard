import React, { createContext, useReducer } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login, Dashboard, Home, PaymentDetails } from "./screens";

import {ErrorPage} from "./components"

import "./App.css";

export const loginContext = createContext();

//login context initial state
const initialState = {
  isLoggedIn: sessionStorage.getItem("isLoggedIn") || false,
  activeUsername: sessionStorage.getItem("activeUsername") || "",
};

//login reducer for actions based upon Login or Logout states
const loginReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        activeUsername: action.payload.username,
        isLoggedIn: true,
      };
    case "LOGOUT":
      return {
        ...state,
        activeUsername: "",
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

// main app component
const App = () => {
  const [loginState, dispatch] = useReducer(loginReducer, initialState); //login dispatcher



  return (
    <loginContext.Provider value={{ loginState, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loginState.isLoggedIn ? (
                <Navigate replace to="/dashboard" />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/dashboard" element={
            (sessionStorage.getItem("userType") !== "visitor") ?
          <Dashboard /> :
          <ErrorPage />
        } />
          <Route path="/home" element={<Home />} />
          <Route path="/PaymentDetails" element={
            (sessionStorage.getItem("userType") === "admin") ?
          <PaymentDetails /> : 
          <ErrorPage />
        } />
        </Routes>
      </BrowserRouter>
    </loginContext.Provider>
  );
};

export default App;
