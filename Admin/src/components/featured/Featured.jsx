import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllTheater,
  getUsers,
  reservationDetails,
} from "../../utils/Constants";


const Featured = () => {
  const [movies, setmovies] = useState([]);

  const [TopBooked, setTopBooked] = useState([]);
  const [Users, setUsers] = useState([]);

  const [Theater, setTheater] = useState([]);

  const token = useSelector((state) => state.token);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  useEffect(() => {
    async function getReservation() {
      await axios
        .get(reservationDetails, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          setmovies(data);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
      await axios
        .get(getUsers)
        .then(({ data }) => {
          setUsers(data.user);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
      await axios
        .get(getAllTheater, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          setTheater(data);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    }
    getReservation();
  }, []);
  const totalRevenue = movies.reduce((acc, ticket) => acc + ticket.total, 0);
  const target = 10000;
  const per = (totalRevenue / target) * 100;

  const reservationsPerDay = movies?.reduce((acc, cur) => {
    const showDate = cur.showDate;
    if (!acc[showDate]) {
      acc[showDate] = 1;
    } else {
      acc[showDate]++;
    }
    return acc;
  }, {});

  const options = { month: "short", day: "numeric", year: "numeric" };
  const reservationsData = Object.keys(reservationsPerDay).map((showDate) => {
    const date = new Date(showDate);
    const formattedDate = date.toLocaleDateString("en-US", options);
    return { x: formattedDate, y: reservationsPerDay[showDate] };
  });

  const xData = reservationsData?.map((reservation) => reservation.x);
  const yData = reservationsData?.map((reservation) => reservation.y);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={10} text={`${per}%`} strokeWidth={5} />
        </div>
        <p className="title">Total sales made today</p>
        <p className="amount">$420</p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className="itemResult negative">
              <KeyboardArrowDownIcon fontSize="small" />
              <div className="resultAmount">$12.4k</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">$12.4k</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">$12.4k</div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Featured;
