

import { Route,Routes,Navigate} from 'react-router-dom'
import Home from './Pages/Home/Home';
import './App.css';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import Profile from './Pages/Profile/Profile';
import Profileedit from './components/Profileedit/Profileedit';
import Detail from './Pages/detail/Detail';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Seating from './components/Seating/Seating';
import SummaryPage from './Pages/SummeryPage/SummeryPage';
import SeeAll from './components/SeeAll/SeeAll';
import {useDispatch, useSelector} from 'react-redux';
import BookingDetails from './Pages/BookingDetails/BookingDetails';
import   Ticket  from './components/OrderHistory/Ticket';

import OtpPage from './Pages/OTPPAGE/otpPage';
import Otp from './Pages/OTP/Otp';
import { useEffect } from 'react';
import PageNotFound from './PageNotFound';
import socket from './socket.io/socket';
import { setLogout } from './Redux/store';



function App() { 
	const token = useSelector(state=>state.token)
	const currentUser = useSelector(state=>state.user)
	const dispatch = useDispatch();

	useEffect(()=>{
		console.log('.gggggggggg');
        socket.emit("newUser",currentUser?._id)
    },[currentUser]);


	useEffect(() => {
		console.log('oooooooooo');
		socket.on("getBlocked", () => {
			console.log('getBlocked');
			dispatch(setLogout());
		});
	  }, []);
	
  return (
    <div className="App">
      <Routes>
       <Route path="/" exact element={<Home />} />
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/otpLogin" exact element={<Otp/>} />
			<Route path="/otp" exact element={<OtpPage/>} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/profile" exact element={<Profile />} />
			<Route path="/editProfile" exact element={<Profileedit/>} />
			<Route path="/MovieDetails/:id" element={<Detail/> } />
			<Route path="/BokingDetails/:id" element={!token ? <Login /> :<BookingDetails/> } />
			<Route path="/booktickets/seats" element={<Seating/> } />
			<Route path="/booktickets/summary" element={<SummaryPage/> } />
			<Route path="/seeAll" element={<SeeAll/> } />
			<Route path="/booking" element={<Ticket/> } />

			<Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
