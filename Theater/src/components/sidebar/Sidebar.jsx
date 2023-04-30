import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PaymentIcon from "@mui/icons-material/Payment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { setLogout } from "../../Redux/store";
import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import {
  getOneTheater,
  getUnrededMessage,
  notificationCountTheater,
} from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const theater = useSelector((state) => state.theater);
  const [theaters, setTheater] = useState([]);
  const theaterId = theater?._id;
  const { dispatch } = useContext(DarkModeContext);
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
    }).then((result) => {
      if (result.isConfirmed) {
        dispatchs(setLogout());
      }
    });
  }
  const token = useSelector((state) => state.token);
  const [read, getRead] = useState([]);

  const [unmessage, setUnMessage] = useState([]);

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

  useEffect(() => {
    const getTheater = () => {
      try {
        axios
          .get(`${getOneTheater}/${theaterId}`)
          .then((response) => {
            setTheater(response.data);
          })
          .catch((error) => {
            if (error.response) {
              generateError(error.response.data.message);
            } else {
              generateError("Network error. Please try again later.");
            }
          });
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          generateError(error.response.data.message);
        }
      }
    };
    getTheater();
  }, []);

  const getUnread = () => {
    try {
      axios
        .get(`${notificationCountTheater}/${theaterId}`, {
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
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  };
  const getUnrededMessages = () => {
    try {
      axios
        .get(`${getUnrededMessage}/${theaterId}`, {
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
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  };


  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">THEATER</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <Link to="/" style={{ textDecoration: "none" }}>
            <p className="title">MAIN</p>
            <li>
              <br />
              <br />
              <DashboardIcon className="icon" />
              <span>DASHBOARD</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          <Link to="/application" style={{ textDecoration: "none" }}>
            <br />

            <li>
              <PersonOutlineIcon className="icon" />
              <span>APPLICATION</span>
            </li>
          </Link>
          <br />

          {theaters?.isApproved && (
            <div>
              <p className="title">THEATER MANAGEMENT</p>
              <br />
              <Link to="/screen" style={{ textDecoration: "none" }}>
                <li>
                  <FitScreenIcon className="icon" />
                  <span>SCREEN</span>
                </li>
              </Link>
              <br />
              <br />
              <Link to="/BookingDetails" style={{ textDecoration: "none" }}>
                <li>
                  <BookOnlineIcon className="icon" />
                  <span>BOOKING MANAGE</span>
                </li>
              </Link>
              <br />
              <br />
              <Link to="/PaymentDetails" style={{ textDecoration: "none" }}>
                <li>
                  <PaymentIcon className="icon" />
                  <span>PAYMENT MANAGE</span>
                </li>
              </Link>
              <br />
              <br />
              {unmessage?.length > 0 ? (
                <Tooltip
                  title={
                    <ul>
                      <strong>ADMIN - </strong>
                      {unmessage?.map((msg) => (
                        <li key={msg?.senderName}>
                          <strong>Message: {msg?.message?.text}</strong>
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <Link to="/theater/chat" style={{ textDecoration: "none" }}>
                    <Badge badgeContent={read} color="error">
                      <ChatIcon className="icon" />
                      <span>CHAT</span>
                    </Badge>
                  </Link>
                </Tooltip>
              ) : (
                <Link to="/theater/chat" style={{ textDecoration: "none" }}>
                  <Badge badgeContent={read} color="error">
                    <ChatIcon className="icon" />
                    <span>CHAT</span>
                  </Badge>
                </Link>
              )}
              <br />
              <br />
            </div>
          )}

          <li>
            <ExitToAppIcon className="icon" />

            <Button onClick={handleLogout}>
              <span>LOGOUT</span>
            </Button>
          </li>
        </ul>
      </div>
      <br />
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
