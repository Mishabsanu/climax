import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TheatersIcon from "@mui/icons-material/Theaters";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MovieIcon from "@mui/icons-material/Movie";
import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import {
  getAllTheater,
  getAllUserss,
  reservationDetails,
} from "../../utils/Constants";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Widget = ({ type }) => {
  const [movies, setmovies] = useState([]);

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
        .get(getAllUserss, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
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

  let data;

  //temporary

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all Users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
        value: Users.length,
        url: "/users-list",
        Percentage: 20,
      };
      break;
    case "order":
      data = {
        title: "THEATERS ",
        isMoney: false,
        link: "View all Theaters",
        icon: (
          <TheatersIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
        value: Theater.length,
        url: "/theater-list",
        Percentage: 20,
      };
      break;
    case "earning":
      data = {
        title: "MOVIE BOOKING",
        isMoney: true,
        link: "View All Booking",
        icon: (
          <MovieIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
        value: movies.length,
        url: "/userBooking",
        Percentage: 10,
      };
      break;
    case "balance":
      data = {
        title: "TOTAL SALES",
        isMoney: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
        value: totalRevenue,
        Percentage: 20,
        url: "#",
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.value}</span>
        <Link style={{ textDecoration: "none" }} to={data.url}>
          <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {data.Percentage} %
        </div>
        {data.icon}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Widget;
