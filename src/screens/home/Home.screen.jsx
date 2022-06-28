import React, {useEffect} from 'react';
import { loginContext } from "../../App";
import  { useContext} from 'react';
import { Footer, Sidebar,Topbar,ErrorPage } from '../../components';
import "./home.styles.css";
import { Box } from '@mui/system';

const Home = () =>{

    
  useEffect(() => {
    document.title = "GreenDot - Home"
 }, []);
    
    //empty component for demo purpose

    const {loginState} = useContext(loginContext); //login context variable

    return(
        <Box>
        {loginState.isLoggedIn ? (
        <section>

             <Topbar />
                 <div className='container'>
          <Sidebar />
          <Box className="homepage" flex={7} height="100vh">
              <h2>Home Page</h2>
            </Box>
            </div>
            <Footer/>
        </section>
        ) : ( <div><ErrorPage/><Footer/></div>

        )
}
        </Box>
    )
};

export default Home;