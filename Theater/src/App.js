import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";

import List from "./Pages/list/List";
import Single from "./Pages/single/Single";
import New from "./Pages/TheaterApplication/New";
import {  Routes, Route ,Navigate} from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import {useSelector} from 'react-redux';
import { DarkModeContext } from "./context/darkModeContext";
import Screen from "./Pages/Screen/Screen";
import AddScreen from "./Pages/AddScreen/AddScreen";
import AddDetails from './Pages/AddDetails/AddDetails'
import EditSreen from "./components/editSreen/EditScreen";
import 'react-toastify/dist/ReactToastify.css';
import EditSreenShow from './components/EditScreeShow/EditScreenShow'
import BookingList from "./components/BookingMnage/BookingList";
import PaymentList from "./components/PaymentManage/PaymentList";
import PaymentViewList from "./components/PaymentViewList/PaymentViewList";
import BookingViewList from "./components/BookingViewList/BookingViewList";
import Chat from "./Pages/Chat/Chat";
import Report from "./Pages/Report/Report";
import ApplicatioEdit from "./components/ApplicatioEdit/ApplicatioEdit";
import PageNotFound from "./PageNotFound";





function App() {
  const { darkMode } = useContext(DarkModeContext);
  const token = useSelector(state=>state.token)
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    return children;
  };


  return (
    <div className={darkMode ? "app dark" : "app"}>

        
          <Routes>
              
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!token ? <Signup/>: <Navigate to="/" />} />
            <Route  path="/" element={token ? <Home />: <Navigate to="/login" />} />
            <Route path="/application" element={<New/>}/>
            <Route path="/screen" element={<Screen/>}/>
            <Route path="/addscreens" element={<AddScreen/>}/>
            <Route path="/editSreen/:id" element={<EditSreen/>}/>
            <Route path="/addTheaterDetails/:id" element={<AddDetails/>}/>
            <Route path="/editSreenShow/:id" element={<EditSreenShow/>}/>
            <Route path="/BookingDetails" element={<BookingList/>}/>
            <Route path="/PaymentDetails" element={<PaymentList/>}/>
            <Route path="/Paymnetview/:id" element={<PaymentViewList/>}/>
            <Route path="/Bookingview/:id" element={<BookingViewList/>}/>
            <Route path="/theater/chat" element={<Chat/>}/>
            <Route path="/salesreport" element={<Report/>}/>
            <Route path="/EditApplication" element={<ApplicatioEdit/>}/>
            <Route path='*' element={<PageNotFound/>}/>
         
          
   
      
          </Routes>
          
 
    </div>
  );
}

export default App;
