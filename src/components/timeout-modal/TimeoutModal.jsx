import React from 'react';
import { Modal, Paper } from '@mui/material';
import { Button,Grid} from '@mui/material';

//Timeoutmodal, will be shown to user after 10 minutes of inactivity, will show 2 option, either to logout or stay logged in, if nothing picked, user will be logged out
//after 5 minutes automatically
const TimeoutModal = ({show, toShowModal, toLogOut}) => {


//function call to stay logged in
const onRequestClose = () => {
    toShowModal(); 
};

//function call to logout
const onRequestLogOut = () => {
    toLogOut();
};

const paperStyle = {
padding: 20,
height: "30vh",
margin: "10% auto",
borderRadius: "1.5rem",

};
const btnstyle={
    margin:"1vh",
    marginTop:"10vh",
    flex:"1"
        }

return (<>
<Modal
    open={show}

    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
>
    <Paper id="loginBox" elevation={12}style={paperStyle} sx={{width:{sx:"50%",sm:"50%",md:"40%"}}}>
    <Grid align="center"><h2 id="warningHeader" color="red" alignItem="center"><strong>Session Timeout</strong></h2></Grid>
    <div id="warningDescription"           paddingTop={"2vh"}
>
        You're being timed out due to inactivity. Please choose to stay signed in or to logout. Otherwise, you will be logged off automatically in 5 minutes.
        </div>
    <div className="btns" justifyContent="center" display="flex" alignItem="center">
    <Button onClick={onRequestLogOut} variant="contained" fontSize="small" style={btnstyle} id="btn1" flex={1}>Logout</Button>
    <Button onClick={onRequestClose}  variant="contained" fontSize="small" style={btnstyle} id="btn2"dlex={1}>Stay Logged In</Button>
    </div>
    
    </Paper>
</Modal>
</>
);
};

export default TimeoutModal;
