import React from "react";
import { PageviewRounded } from '@mui/icons-material';
import { Table, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Button, InputLabel, Select, MenuItem, TableBody,makeStyles} from '@mui/material';
import "./paymentTable.styles.css"
import { useNavigate} from "react-router-dom";

//payment table component contains the view part of payment table and props
const PaymentTable = ({
handleNextPage,
handlePreviousPage,
pageNavbtn,
pageNumber,
paymentData,
recordsLimitState,
tableEntriesHandler,
totalPages,
pagesNumberForPagination,
changePage,
formData,
recordsLimit


}) => {
let navigate = useNavigate();

window.scrollBy(0, 5000);

//function to handle the payment detail page navigation functionality.
// Basically stores the filter form state and navigate to payment details page where transaction detail of a particular page will be shown
const handlePaymentDetail = (key) => {
  navigate('/PaymentDetails', { state: { confirmationKey: key, formData: formData, pageNumber: pageNumber, recordsLimit: recordsLimit } })
}
return (
  <TableContainer component={Paper } >
    <div id="recNo">
      <FormControl>
        <InputLabel id="demo-simple-select-standard-label1" >Select Number of Records</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          disabled={totalPages===0}
          value={recordsLimitState}
          onChange={tableEntriesHandler}
          sx={{width:"200px"}}
          label="Number of Records per page"
        >
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"10"}>10</MenuItem>
          <MenuItem value={"15"}>15</MenuItem>
          <MenuItem value={"20"}>20</MenuItem>
        </Select>
      </FormControl>
    </div>
    <br />
    <br />
    <Table className="tables" aria-label="simple table"  >
      <TableHead >
        <TableRow>
          <TableCell align="left">Status</TableCell>
          <TableCell align="left">Account Number</TableCell>
          <TableCell align="left">Channel</TableCell>
          <TableCell align="left">Confirmation Number</TableCell>
          <TableCell align="left">Email</TableCell>
          <TableCell align="left">Payment Amount</TableCell>
          <TableCell align="left">Payment Method</TableCell>
          <TableCell align="left">Payment Type</TableCell>
          <TableCell align="left">Date</TableCell>
          <TableCell align="left">User ID</TableCell>
          { (sessionStorage.getItem("userType") === "admin") ? 
          <TableCell align="left">Actions</TableCell> :
          <></>
          }
        </TableRow>
      </TableHead>
      <TableBody >
        {paymentData.map((payment) => (
          <TableRow key={payment.confirmationNumber + payment.accountNumber} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell component="th" scope="payment">{payment.Status}</TableCell>
            <TableCell align="left">{payment.accountNumber}</TableCell>
            <TableCell align="left">{payment.channel}</TableCell>
            <TableCell align="left">{payment.confirmationNumber}</TableCell>
            <TableCell align="left">{payment.email}</TableCell>
            <TableCell align="left">{payment.paymentAmount}</TableCell>
            <TableCell align="left">{payment.paymentMethod}</TableCell>
            <TableCell align="left">{payment.paymentType}</TableCell>
            <TableCell align="left">{payment.paymentDate}</TableCell>
            <TableCell align="left">{payment.userId}</TableCell>
            { (sessionStorage.getItem("userType") === "admin") ?
            <TableCell align="left" onClick={() => handlePaymentDetail(payment.confirmationNumber)}>
            <PageviewRounded style={{ color: "blue" }}/> Details</TableCell>   :
            <></>  
            }          
          </TableRow>
          ))}
      </TableBody>
    </Table>
<div className="btns">
<div className="bt1">
    <Button 
    
      type="button" 
      variant="contained" 
      size="small" 
      disabled={pageNumber === 1} 
      onClick={handlePreviousPage} 
      style={pageNavbtn}
    >
      Previous Page
    </Button>
    </div>

      {pagesNumberForPagination.map(pagesNumber => (
      <div className="btall">
           <Button  
                  sx={{"&:active":{
                  backgroundColor:"darkBlue"
                  },
                  "&:inactive":{
                  backgroundcolor:"yellow"
                  }}
                  }
                  key={pagesNumber}
                  onClick={() => changePage(pagesNumber)}
            >
      {pagesNumber}
      </Button>
      </div>
      ))}
      <div className="bt2">

    <Button 
    
      type="button"
      variant="contained" 
      size="small"  
      disabled={pageNumber === totalPages || totalPages===0} 
      
      onClick={handleNextPage} 
      style={pageNavbtn}
    >
      Next Page
    </Button>
    </div>
    </div>
  </TableContainer>
);
};

export default PaymentTable;