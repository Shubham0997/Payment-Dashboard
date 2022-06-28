import React from "react";
import { ScreenSearchDesktop, SearchRounded } from '@mui/icons-material';
import { Paper, FormControl, TextField, Button, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import "../dashboard.styles.css";

const textfieldStyle={};

const buttonStyle = {
  margin: "40px auto",
  borderRadius: "1rem",
  backgroundColor: "#357cc1"
};

const paperStyle = {
  padding:40,
  marginBottom:"4rem",
  margin: "-1% 2vh",
  borderRadius: "1.5rem", 
  backgroundColor: "aliceblue", 
  minHeight: "300px",
};

//Filter form "Dumb component", contains the view part of filter form and props
const FilterForm = ({ 
  filterFunctionality,
  menuItemObj,
  inputHandler,
  invalidPaymentAmountRange,
  invalidPaymentDateRange,
  atLeastOneFieldRequired,
  formData,
  dateRange,
  dateRangeVisible,
  dateRangeRequiredMessage,
  inputDateMessage,
  inputAmountMessage



}) => {

 

  return (<Paper id="searchForm" elevation={10} style={paperStyle}>
    <Grid id="iconHeading"align="center" marginBottom="5rem" color="rgb(87, 87, 216)" display="flex" textAlign={"center"}>
      <ScreenSearchDesktop fontSize="large" id="desktopIcon" />
      <h2 id="heading"backgroundColor="blue">Filter Form</h2>
    </Grid >
    <form onSubmit={filterFunctionality} id="filterform">

    

      { sessionStorage.getItem("userType") === "admin" ? 
        <TextField style={textfieldStyle}
        className="standard-basic"
        label="User ID"
        fullWidth
        value={formData.userId || "" }
        onChange={inputHandler}
        type="text"
        name="userId"
        variant="standard"
      /> :
      <></>
      }

      { sessionStorage.getItem("userType") === "admin" ? 
      <><br /><br /><TextField style={textfieldStyle}
          className="standard-basic"
          label="Confirmation Number"
          fullWidth
          value={formData.confirmationNumber || ""}
          onChange={inputHandler}
          type="number"
          name="confirmationNumber"
          variant="standard" /><br /><br /><TextField
            style={textfieldStyle}
            className="standard-basic"
            label="Account Number"
            fullWidth
            value={formData.accountNumber || ""}
            onChange={event => inputHandler(event)}
            type="number"
            name="accountNumber"
            variant="standard" /><br /><br /><TextField style={textfieldStyle}
              className="standard-basic"
              label="Email Address "
              fullWidth
              value={formData.email || ""}
              onChange={inputHandler}
              type="email"
              name="email"
              variant="standard" /><br /><br /></>  :
      <><br /><br /></>
    }
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Channel</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.channel}
          onChange={inputHandler}
          label="Channel"
          name="channel"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            menuItemObj.hasOwnProperty('metaFeildschannel') && menuItemObj['metaFeildschannel']
            .map((item) => (<MenuItem value={item} key={item}>{item}</MenuItem>))
          }
        </Select>
      </FormControl>
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-standard-label">Payment Method</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={formData.paymentMethod}
          onChange={inputHandler}
          label="Payment Method"
          name="paymentMethod"
        >
          <MenuItem value={""}>
            <em>None</em>
          </MenuItem>
          {menuItemObj.hasOwnProperty('metaFeildsPaymentMethod') && menuItemObj['metaFeildsPaymentMethod'].map((item) => (<MenuItem value={item} key={item}>{item}</MenuItem>))}
        </Select>
      </FormControl>
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-standard-label">Payment Type</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={formData.paymentType}
          onChange={inputHandler}
          label="Payment Type"
          name="paymentType"
        >
          <MenuItem value={""}>
            <em>None</em>
          </MenuItem>
          {menuItemObj.hasOwnProperty('metaFeildsPaymentType') && menuItemObj['metaFeildsPaymentType'].map((item) => (<MenuItem value={item} key={item}>{item}</MenuItem>))}
        </Select>
      </FormControl>
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel className="demo-simple-select-standard-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={formData.Status}
          onChange={inputHandler}
          
          label="status"
          name="Status"
        >
          <MenuItem value={""}>
            <em>None</em>
          </MenuItem>
            {menuItemObj.hasOwnProperty('metaFeildsStatus') && menuItemObj['metaFeildsStatus'].map((item) => (<MenuItem value={item} key={item}>{item}</MenuItem>))}
        </Select>
      </FormControl>
      <br />
      <br />
      <br />
      <h3>Payment Amount Range :</h3>
      <br />
      <TextField style={textfieldStyle}
        className = "standard-basic"
        label="From "
        fullWidth
        value={formData.paymentAmountMinRange || ""}
        onChange={inputHandler}
        type="number"
        name="paymentAmountMinRange"
      />
      <br />
      <br />
      <TextField style={textfieldStyle}
        className = "standard-basic"
        label="To "
        fullWidth
        value={formData.paymentAmountMaxRange || ""}
        onChange={inputHandler}
        type="number"
        name="paymentAmountMaxRange"
      />
      <br />
      <div className="errorMSG">{inputAmountMessage}</div>
      <br />
      <br />
      <div className="errorMSG">{invalidPaymentAmountRange}</div>
      <br />
      <br />

      <h3>Payment Date Range:</h3>
      <br />
      <br />

      <FormControl fullWidth>
        <InputLabel className="demo-simple-select-standard-label">Select date range</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={dateRange.datesRange || ""}
          onChange={inputHandler}
          label="Select date range"
          name="datesRange"
        >
          <MenuItem value={""}>
            <em>None</em>
          </MenuItem>

          <MenuItem value={"Last 7 days"}>
            <em>Last 7 days </em>
          </MenuItem>

          <MenuItem value={"Last month"}>
            <em>Last month </em>
          </MenuItem>

          <MenuItem value={"Last 6 months"}>
            <em>Last 6 months </em>
          </MenuItem>

          <MenuItem value={"Custom range"}>
            <em>Custom range </em>
          </MenuItem>
         
        </Select>
      </FormControl>


      <br />
      <br />
      <br />
      <div className="errorMSG">{dateRangeRequiredMessage}</div>
      <br />
      <div className="errorMSG">{inputDateMessage}</div>
      <br />

  { dateRangeVisible && <>
      <br />
      <div className="endDpicker">
        <p className="endDheading">Start Date:{" "}</p>
        <input
          type="date"
          name="startDate"
          value={formData.startDate || ""}
          onChange={inputHandler}
          className="datePicker"
          id="startDvalue"
        />
      </div>
      <br />
      <br />
      <div className="endDpicker">
        <p className="endDheading">End Date:{" "}</p>
        <input
          type="date"
          name="endDate"
          value={formData.endDate || ""}
          onChange={inputHandler}
          className="datePicker"
          id="endDvalue"
        />
      </div>
      <br />
      <div className="errorMSG">{invalidPaymentDateRange}</div>
      </>}
      <br />
      <div className="errorMSG">{atLeastOneFieldRequired}</div>

      <Button type="submit" variant="contained" value="Search" size="medium" style={buttonStyle}>
        <SearchRounded/>Search
      </Button>
    </form>
  </Paper>);
};

export default FilterForm