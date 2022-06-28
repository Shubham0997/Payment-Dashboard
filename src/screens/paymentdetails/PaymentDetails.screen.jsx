import { Box,Button,Stack } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { useLocation } from 'react-router-dom'
import { useNavigate} from "react-router-dom";

import { loginContext } from "../../App";

import { Footer, Sidebar,Topbar, ErrorPage} from '../../components';
import "./paymentDetails.styles.css";




//payment details page to display the transaction details of each individulal transaction
const PaymentDetails = (props) =>{

  useEffect(() => {
    document.title = "GreenDot - Payment Details"
 }, [])

const {loginState} = useContext(loginContext); // login context variable
const [isDataPresent, setIsDataPresent] = useState(false);

//transaction details variable
const [paymentDetails, setPaymentDetails] = useState([]);


let navigate = useNavigate();

const location = useLocation()

//confirmation key variable passed on from the dashboard to fetch the transaction details.
const { confirmationKey } = location.state

//function to fetch the transaction detail through API using confirmation key.
useEffect(() =>{
  const getPaymentDetails =  async () => {
    const token = sessionStorage.getItem("accessToken"); // getting access token from session variable as required to fetch data.

    //body object to be sent with api
    const requestBody = {
      "confirmationNumber": confirmationKey
    };

    // data object which will be sent with the api to fetch the data
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
      body: JSON.stringify(requestBody)
    };

    // POST request with a JSON body using fetch
    const request = fetch('http://localhost:3300/payments/paymentDetails', requestOptions);
    const response = await  request;
    const data = await  response.json(); // storing the fetched data as a JSON object

    setPaymentDetails(data) // setting the transaction details into a state variable to display on the page
    setIsDataPresent(true)
  };

  getPaymentDetails();
},[]);

//function to handle the back button functionality
const handleBack = () =>{
sessionStorage.setItem("isBackButtonClicked", true); //setting up session variable to store if back button is clicked or not.
navigate("../dashboard", location); // navigating back to dashboard
}

const buttonStyle = {
borderRadius: "1rem",
backgroundColor: "#357cc1",
};
  return(
      <Box>
      {loginState.isLoggedIn ? (
  <>
  <Topbar />
  <Stack direction="row" spacing={3} justifyContent="space-between" height={"auto"}>
<Sidebar />
          { isDataPresent &&
          <Box className="payment-details" sx={{flex:{xs:"7",sm:"10",md:"10",lg:"10"}}} >
            <div className="PLogo" color="blue">Paymentus</div>  
          {paymentDetails.map((detail)=>(
                      <div id="details">
                      <strong> <div id="header" diplay="flex"><div flex="1" id="l1" className="fif">Payment</div><div id="l2" flex="1" className="fif">Details</div></div></strong>
                      <div className="row">
                  <div className="row-Header">
                  <b>Name :</b></div> <div className="detsDisplay">{detail.Name}</div><br></br><br></br></div>
                  <div className="row">
                  <div className="row-Header">
                  <b> Status :</b> </div><div className="detsDisplay">{detail.Status}</div><br></br><br></br></div>  
                  <div className="row">
                  <div className="row-Header">

                  <b>Zip :</b></div> <div className="detsDisplay">{detail.Zip}</div><br></br><br></br> </div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Account Number :</b></div><div className="detsDisplay">{detail.accountNumber}</div><br></br><br></br> </div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Card Number :</b> </div><div className="detsDisplay">{detail.cardNumber}</div><br></br><br></br> </div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Card Type :</b> </div><div className="detsDisplay">{detail.cardType}</div><br></br> <br></br></div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Channel :</b></div> <div className="detsDisplay">{detail.channel}</div><br></br> <br></br></div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Confirmation Number :</b></div> <div className="detsDisplay">{detail.confirmationNumber}</div><br></br><br></br> </div>
                  <div className="row">
                  <div className="row-Header">

                  <b> Contact Number :</b> </div><div className="detsDisplay">{detail.contactNumber}</div><br></br> <br></br></div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Email :</b></div> <div className="detsDisplay">{detail.email}</div><br></br><br></br> </div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Payment Amount :</b> </div><div className="detsDisplay">{detail.paymentAmount}</div><br></br><br></br></div>
                  <div className="row"> 
                  <div className="row-Header">

                  <b>Payment Date :</b></div> <div className="detsDisplay">{detail.paymentDate}</div><br></br><br></br></div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Payment Method :</b> </div><div className="detsDisplay">{detail.paymentMethod}</div><br></br><br></br></div>
                  <div className="row">
                  <div className="row-Header">

                  <b>Payment Type :</b> </div><div className="detsDisplay">{detail.paymentType}</div><br></br><br></br></div>
                  <div className="row">
                  <div className="row-Header">

                  <b>User ID :</b></div> <div className="detsDisplay">{detail.userId}</div><br></br> <br></br></div>                 
                    </div>

              ))}

    <div className="btns1" justifycontent="center">
              <Button id="btn1"
              type="submit"
              value="Submit"
              variant="contained"
              size="medium"
              style={buttonStyle}
              sx={{xs:"fullwidth"}}
              onClick={() => window.print()} 
                            
            >
              {" "}
              Print{" "}
            </Button>{" "}
              <Button id="btn2"
              type="submit"
              value="Submit"
              variant="contained"
              size="medium"
              sx={{xs:"fullwidth"}}
              style={buttonStyle}
              onClick={handleBack}
              
            >
              {" "}
              Back{" "}
            </Button>{" "}
            </div>
          </Box>

          
}
</Stack>
      </>
      
      ) : ( <div><ErrorPage/></div>)
}<Footer/>

      </Box>
  )
};

export default PaymentDetails;