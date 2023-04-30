import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";

import DailyRevenueGraph from "../../components/chart/dily/Daily";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Year from "../../components/chart/Year/Year";
import Weekly from "../../components/chart/Weekly/Weekly";
import Month from "../../components/chart/Monthy/Month";
const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div style={{padding:"20px"}}>
          <Link  style={{textDecoration:"none"}} to='/salesreport'>
          <Button variant="contained">SALES REPORT</Button>
          </Link>
          </div>
        
        <div className="charts">
          <DailyRevenueGraph title="DAILY  BOOKING" aspect={2 / 1} />
          <Weekly title="WEEKLY  BOOKING" aspect={2 / 1} />
        </div>
        <div className="charts">
          <Month title="MONTHLY BOOKING" aspect={2 / 1} />
          <Year title="YEARLY BOOKNIG" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default Home;

