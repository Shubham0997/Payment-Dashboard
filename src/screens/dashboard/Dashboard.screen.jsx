import React, { useState, useContext, useEffect  } from "react";

import { loginContext } from "../../App";

import { FilterForm, PaymentTable } from "./components";

import { Sidebar, Topbar, Footer, ErrorPage } from "../../components";

import { Box, Grid, Stack } from "@mui/material";

import { useLocation} from "react-router-dom";

let recordsLimit = 5; // number of records fetched in a single API hit, by default set as 5
let pageNumber = 1; //current page number, by default set 1
let totalData = 0; //total number of records present on a filter
let totalPages = 0; //total number of pages
let prevPage = 0;
var isDateDefault;

 // new comment
// dashboard page which provides the functionality to display the filter form and based upon filters fetch the data from the database using the API and display them on the table
const Dashboard = () => {

  //setting up page title
  useEffect(() => {
    document.title = "GreenDot - Dashboard"
 }, []);

  // Login context variable
  const { loginState } = useContext(loginContext); // Login context variable

  //state variable to show or hide the transaction table
  const [isTableVisible, setTableVisible] = useState(false); 

  // state variable to show or hide the date range based upon type of date range opted by user
  const [dateRangeVisible, setDateRangeVisible] = useState(false); 

  // state variable to display messages regarding date range
  const [dateRangeRequiredMessage, setDateRangeRequiredMessage] = useState(""); 

  //payment or transaction details state variable, will store the data which will come from API and will be shown on the table
  const [paymentData, setPaymentData] = useState([]); 
  
  // state variable to set messages regarding amount range
  const [invalidPaymentAmountRange, setInvalidPaymentAmountRange] = useState(""); 

  // state variable to show messages regarding validation of date range
  const [invalidPaymentDateRange, setInvalidPaymentDateRange] = useState(""); 

  // state variable to show message if start date is selected and end date is not ans vice-versa
  const [inputDateMessage,setInputDateMessage] = useState(""); 

  // state variable to display the message if search button is clicked and no field is entered
  const [atLeastOneFieldRequired, setAtLeastOneFieldRequired] = useState(""); 

  // state variable to store the Select type inputs from the database.
  const [menuItemObj, setMenuItemObj] = useState({}); 

  // array to store the count of page numbers for pagination
  const pagesNumber = []; 

  // state varibale to store the number of records needed to be fetched on a single hit to API
  const [recordsLimitState, setRecordsLimitState] = useState("5"); 

  const location = useLocation();

  // state variable to store the inputs from the filter form, which will be used to fetch the transactions from the database
 const [formData, setFormData] = useState({
    userId: (sessionStorage.getItem("userType") === "biller") ? sessionStorage.getItem("userId") : "",
    confirmationNumber: "",
    paymentType: "" ,
    accountNumber: "" ,
    email: "",
    channel: "",
    paymentAmountMinRange: "",
    paymentAmountMaxRange: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    Status: "",
  });  

  // state variable to store the type of date range being set, for instance, "custom range", "Last 6 months"
  const [dateRange, setDateRange] = useState({
    datesRange:"" ,
  }); 


// function which will be triggered on each page load, which will fetch the select options from the database for the filter form
useEffect(() => {
  const getSelectOptions = async () => {
    const token = sessionStorage.getItem("accessToken"); //fetching access token as its required to fetch the data
  
    //object of data to be sent with the api
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
    };
    
    const request = await fetch('http://localhost:3300/payments/meta-data', requestOptions);
    const response = await request;
    const data = await response.json();  //storing the data from result of API as a json object
    setMenuItemObj({...data}); //setting up the data in menuItemObj state variable
  };

  getSelectOptions();
}, []);


//function to handle the back button click on paymentDetails page
useEffect(() => {
  let isBackButtonClicked= sessionStorage.getItem("isBackButtonClicked"); //backButtonClicked variable which is set true when back button is clicked
  
  //if back button is clicked, variable is set "true", if set true, form will be filled with data from previous form state
  if(isBackButtonClicked==='true'){

    //setting form values
    formData.userId=location.state.formData.userId
    formData.confirmationNumber=location.state.formData.confirmationNumber
    formData.paymentType=location.state.formData.paymentType
    formData.accountNumber=location.state.formData.accountNumber
    formData.email=location.state.formData.email
    formData.channel=location.state.formData.channel
    formData.paymentAmountMinRange=location.state.formData.paymentAmountMinRange
    formData.paymentAmountMaxRange=location.state.formData.paymentAmountMaxRange
    formData.startDate=location.state.formData.startDate
    formData.endDate=location.state.formData.endDate
    formData.paymentMethod=location.state.formData.paymentMethod
    formData.Status=location.state.formData.Status

    dateRange.datesRange=location.state.formData.datesRange

    //setting date range visible is date range type is " custom range"
    if(dateRange.datesRange==="Custom range"){
      isDateDefault=false
      setDateRangeVisible(true)
    }

    setRecordsLimitState(location.state.recordsLimit) //setting record limit from previous state
    pageNumber=location.state.pageNumber //setting page number from previous state

    getTableData(pageNumber, location.state.recordsLimit) //getting table data on the table w.r.t previous state
    setTableVisible(true);

    sessionStorage.setItem("isBackButtonClicked", false); //setting button variable back to false, so that dashboard state is only regained upon clicking back
  }
}, [])


//function to format date pattern
function formatDate(date){
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = yyyy+'-'+mm+'-'+dd;
  return date
}

// function to get the date of last Nth date
function LastNdays (numberOfDays) {
var result = [];

    var d = new Date();
    d.setDate(d.getDate() - numberOfDays);
    result.push( formatDate(d) )
    return(result.join(','));
}

//function to get the today's date
function today (){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+((today.getDate()));
  return date;
}


//input handler function to handle the input changes on the filter form
const inputHandler = (e) => {
  pageNumber = 1;
  recordsLimit=5;
  setRecordsLimitState("5")


  setTableVisible(false);

  //handling custom date range condition
  if(e.target.name==="datesRange"){
    if(e.target.value === "Custom range"){
      formData.startDate=""
      formData.endDate=""
      isDateDefault=false
      setDateRangeVisible(true)
    }else{
      setDateRangeVisible(false)
    }
  }

  //handling various N days date condition
  if(e.target.name==="datesRange"){

    if(e.target.value === "Last 7 days"){
      isDateDefault=false
      setDateRangeVisible(false)
      formData.endDate=today();
      formData.startDate=LastNdays(7)
    }

    if(e.target.value === "Last month"){
      isDateDefault=false
      setDateRangeVisible(false)
      formData.endDate=today();
      formData.startDate=LastNdays(31)

    }

    if(e.target.value === "Last 6 months"){
      isDateDefault=false
      setDateRangeVisible(false)
      formData.endDate=today();
      formData.startDate=LastNdays(180)
    }

    if(e.target.value===""){
      isDateDefault=false
      formData.endDate="";
      formData.startDate="";
    }

  }
  
   //handling the validation that minimum amount should be less than maximum amount
  if (e.target.name === "paymentAmountMinRange") {                
    if (Number(e.target.value) > Number(formData.paymentAmountMaxRange)) {
      setInvalidPaymentAmountRange("Invalid amount Range");
    } else {
      setInvalidPaymentAmountRange("");
    }
  } else if (e.target.name === "paymentAmountMaxRange") {
    if (Number(e.target.value) < Number(formData.paymentAmountMinRange)) {
      setInvalidPaymentAmountRange("Invalid amount Range");
    } else {
      setInvalidPaymentAmountRange("");
    }
    //handling the validation that start date should be less than end date
  } else if (e.target.name === "startDate") {
    if (new Date(e.target.value) > new Date(formData.endDate)) {
      setInvalidPaymentDateRange("Invalid date Range");
    } else {
      setInvalidPaymentDateRange("");
    }
  } else if (e.target.name === "endDate") {
    if (new Date(e.target.value) < new Date(formData.startDate)) {
      setInvalidPaymentDateRange("Invalid date Range");
    } else {
      setInvalidPaymentDateRange("");
    }
  } 

  //setting up message to select the end range if user only picks the start date
  if(e.target.name==="startDate"){
    if((e.target.value!=="")&&(formData.endDate==="")){
      setInputDateMessage("Please select end date range");
    }else{
      setInputDateMessage("")
    }
  }

  //setting up message to select the start range if user only picks the end date
  if(e.target.name==="endDate"){
    if((e.target.value!=="")&&(formData.startDate==="")){
      setInputDateMessage("Please select start date range");
    }else{
      setInputDateMessage("")
    }
  }


  //setting the date range data
  setDateRange(prevState=>({
    ...prevState,
    [e.target.name]: e.target.value,
  }));

  //setting the form data
  setFormData(prevState => ({
    ...prevState,
    [e.target.name]: e.target.value,
  }));

};


//function to handle the "Search" button on the filter form. Various validations will be done. if satisfied, data will be fetched
const filterFunctionality = (event) => {
    event.preventDefault();
    setTableVisible(false);

    // Setting up a default date range of 15 days, if filters which could fetch a large amount of data are selected
    if(((formData.channel!=="")||(formData.paymentMethod!=="")||(formData.paymentType!=="")||(formData.Status!=="")||(formData.paymentAmountMinRange!=="")
    ||(formData.paymentAmountMaxRange!==""))&&((formData.userId==="")&&(formData.confirmationNumber==="")&&(formData.accountNumber==="")&&(formData.email==="")
    &&((formData.startDate==="")&&(formData.endDate==="")))){
      isDateDefault=true;
      formData.endDate=today();
      formData.startDate=LastNdays(15)
    }
 
    // removing the default date range if precise filters (which would fetch limited data) are selected
    if((formData.userId!=="")||(formData.confirmationNumber!=="")||(formData.accountNumber!=="")||(formData.email!=="")){
      if(isDateDefault){
        formData.startDate="";
        formData.endDate="";
        isDateDefault=false;
      }
    }
    
    // setting message "default range set" if default range is set
    if(isDateDefault===true){
      setDateRangeRequiredMessage("Default date range (Last 15 days) opted by default")
    }else{
      setDateRangeRequiredMessage("")
    }

    //handling the situation if search button is clicked if no filter is selected
    if((formData.userId==="")&&(formData.confirmationNumber==="")&&(formData.paymentType==="")&&(formData.email==="")&&(formData.channel==="")&&(formData.paymentAmountMinRange==="")
    &&(formData.paymentAmountMaxRange==="")&&(formData.startDate==="")&&(formData.endDate==="")&&(formData.paymentMethod==="")&&(formData.Status==="")){
      setTableVisible(false);
      setAtLeastOneFieldRequired("At least one field needs to be filled");
      return;
    } else {
      setAtLeastOneFieldRequired("");
    }

    //fetching data if filter form entries are valid
    if (!atLeastOneFieldRequired && !invalidPaymentAmountRange && !invalidPaymentDateRange && !inputDateMessage) {
      getTableData(pageNumber, recordsLimit);
      setTableVisible(true);
      
    }
};

// function to fetch the data using the filter parameters by hitting the API with those filters and authentication token
const getTableData = async (pageNumber, fetchRecordLimit) => {


    const token = sessionStorage.getItem("accessToken"); // getting access token from session storage
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token 
      },
      body: JSON.stringify(formData)
    };// setting up data to be sent to API to fulfill the fetch request including header and body

    try {


        const request = await fetch(`http://localhost:3300/payments?limit=${fetchRecordLimit}&page=${pageNumber}`, requestOptions); // fetching the data
        const response = await request;
        const data = await response.json(); //storing the data as a JSON object
        totalData = data.numberOfRecords; //storing the total number of transactions which are being fetched using above filters
        totalPages = Math.ceil(totalData / recordsLimit); // getting total number of pages  
        setPaymentData(data.payments); //setting up transaction in the state variable to be shown in the transaction table.
    
    } catch (error) {
      
    }
  }; 

// filling the array with page numbers for pagination 
for(let i=1;i<=totalPages;i++){
  pagesNumber.push(i)
}
    
// handling the next page button click event. will fetch the data of the immediate next page and will show that in the table
const handleNextPage = () => {
  if (pageNumber >= totalPages) return;
  pageNumber++;
  getTableData(pageNumber,recordsLimit);
};

// handling the previous page button click event. will fetch the data of the immediate previous page and will show that in the table
const handlePreviousPage = () => {
  if (pageNumber <= 1) return;
  pageNumber--;
  getTableData(pageNumber,recordsLimit);
};

// handling the change page functionality. If user clicks on a particular page number to navigate to that page
const changePage = (numberOfPage) =>{
  pageNumber=numberOfPage
  getTableData(pageNumber,recordsLimit);
};

//handling the situation when number of pages are changed
const tableEntriesHandler = (event) => {
  prevPage = pageNumber;
  setRecordsLimitState(event.target.value)
  recordsLimit = event.target.value;
  totalPages = Math.ceil(totalData / recordsLimit);
  if (prevPage > totalPages) {
    pageNumber = totalPages;
  }
  getTableData(pageNumber, recordsLimit);
};
    
  const pageNavbtn = {
    marginLeft: "20px",
    marginBottom: "20px",
    marginTop:"0"
  };

  
  return (
    <Box>
      {loginState.isLoggedIn ? (
        <section>
          <Topbar />
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Sidebar />
            <Box className="dashboard" sx={{flex:{xs:"7",sm:"10",md:"10",lg:"10"}}} width="80%">
              
              <br />
              <br />
               <Box sx={{width:{xs:"95%",sm:"80%"}}} marginBottom="4rem">
              <FilterForm
                filterFunctionality={filterFunctionality}
                inputHandler={inputHandler}
                menuItemObj={menuItemObj}
                invalidPaymentAmountRange={invalidPaymentAmountRange}
                invalidPaymentDateRange={invalidPaymentDateRange}
                atLeastOneFieldRequired={atLeastOneFieldRequired}
                formData={formData}
                dateRange={dateRange}
                dateRangeVisible={dateRangeVisible}
                dateRangeRequiredMessage={dateRangeRequiredMessage}
                inputDateMessage={inputDateMessage}
      
               
              /></Box>

              {isTableVisible && 
                
                  <Grid>
                  <div className="transactions" ></div>
                  <Box className="transactionTable" sx={{width:{xs:"95%",sm:"90%", md:"95%"}}}>
                    <strong>
                      <h2>Transactions:</h2>
                    </strong>
                    <PaymentTable
                      handleNextPage={handleNextPage}
                      handlePreviousPage={handlePreviousPage}
                      pageNavbtn={pageNavbtn}
                      pageNumber={pageNumber}
                      paymentData={paymentData}
                      recordsLimitState={recordsLimitState}
                      tableEntriesHandler={tableEntriesHandler}
                      totalPages={totalPages}
                      pagesNumberForPagination={pagesNumber}
                      changePage={changePage}
                      formData={formData}
                      recordsLimit={recordsLimit}
                  
                
                    />
                  </Box>
                  </Grid>
                }
            </Box>
          </Stack>
          <Footer/>
        </section>
      ) : (
        <div>
          <ErrorPage />
          <Footer />
        </div>
      )}
    </Box>
  );
};
export default Dashboard;
