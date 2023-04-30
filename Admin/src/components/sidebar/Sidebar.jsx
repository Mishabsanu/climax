import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MovieIcon from "@mui/icons-material/Movie";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TheatersIcon from "@mui/icons-material/Theaters";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../Redux/store";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";
import Swal from "sweetalert2";
import axios from "../../utils/axios";
import Tooltip from "@mui/material/Tooltip";
import {
  getUnrededMessage,
  notificationCountAdmin,
} from "../../utils/Constants";

import { toast, ToastContainer } from "react-toastify";
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const disPatch = useDispatch();
  const dispatchs = useDispatch();

  function handleLogout() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatchs(setLogout());
        }
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  }
  const token = useSelector((state) => state.token);
  const [read, getRead] = useState([]);
  const [unmessage, setUnMessage] = useState([]);

  // Map over the unread messages to get their text content

  useEffect(() => {
    getUnread();
  }, []);
  useEffect(() => {
    getUnrededMessages();
  }, []);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const admin = useSelector((state) => state.admin);

  const getUnread = () => {
    axios
      .get(`${notificationCountAdmin}/${admin._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getRead(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };
  const getUnrededMessages = () => {
    axios
      .get(`${getUnrededMessage}/${admin._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUnMessage(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ADMIN </span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <Link to="/" style={{ textDecoration: "none" }}>
            <p className="title">MAIN</p>
            <li>
              <br />

              <DashboardIcon className="icon" />
              <span>DASHBOARD</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          <Link to="/users-list" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>USERS</span>
            </li>
          </Link>
          <br />

          <Link to="/theater-list" style={{ textDecoration: "none" }}>
            <li>
              <TheatersIcon className="icon" />
              <span>THEATER</span>
            </li>
          </Link>

          <p className="title">BOOKING MANAGMENT</p>
          <Link to="/userBooking" style={{ textDecoration: "none" }}>
            <li>
              <BookOnlineIcon className="icon" />
              <span>USER BOOKING</span>
            </li>
          </Link>
          <br />

          <Link to="/theaterBooking" style={{ textDecoration: "none" }}>
            <li>
              <BookOnlineIcon className="icon" />
              <span>THEATER BOOKING </span>
            </li>
          </Link>

          <p className="title">POSTER MANAGMENT</p>
          <Link to="/addPoster" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>ADD POSTER</span>
            </li>
          </Link>

          <br />
          <Link style={{ textDecoration: "none" }} to="/listPoster">
            <li>
              <MovieIcon className="icon" />
              <span>POSTER</span>
            </li>
          </Link>

          <p className="title">MOVIE MANAGMENT</p>
          <Link style={{ textDecoration: "none" }} to="/movieList">
            <li>
              <MovieIcon className="icon" />
              <span>MOVIES</span>
            </li>
          </Link>

          <br />

          <Link to="/addMovies" style={{ textDecoration: "none" }}>
            <li>
              <AddAPhotoIcon className="icon" />
              <span>ADD Movies</span>
            </li>
          </Link>
          <br />
          {unmessage?.length > 0 ? (
            <Tooltip
              title={
                <ul>
                  {unmessage?.map((msg) => (
                    <li key={msg?.senderName}>
                      <strong>
                        {msg?.senderName} - <span></span>Message:{" "}
                        {msg?.message?.text}
                      </strong>
                    </li>
                  ))}
                </ul>
              }
            >
              <Link to="/Admin/chat" style={{ textDecoration: "none" }}>
                <Badge badgeContent={read} color="error">
                  <ChatIcon className="icon" />
                  <span>CHAT</span>
                </Badge>
              </Link>
            </Tooltip>
          ) : (
            <Link to="/Admin/chat" style={{ textDecoration: "none" }}>
              <Badge badgeContent={read} color="error">
                <ChatIcon className="icon" />
                <span>CHAT</span>
              </Badge>
            </Link>
          )}

          <br />

          <li>
            <ExitToAppIcon className="icon" />

            <Button onClick={handleLogout}>
              <span>LOGOUT</span>
            </Button>
          </li>
        </ul>
      </div>
      <br />

      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
