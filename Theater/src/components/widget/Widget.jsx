import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { useState } from "react";
import MovieIcon from "@mui/icons-material/Movie";
import { OnereservationDetails, TheaterUserCount } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

const Widget = ({ type }) => {
  let data;

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const [totalRevene, setTotalRevene] = useState([]);
  const [count, setCount] = useState([]);

  const theater = useSelector((state) => state.theater);
  const theaterId = theater?._id;
  const token = useSelector((state) => state.token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${OnereservationDetails}/${theaterId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalRevene(response.data);
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
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const response = await axios.get(`${TheaterUserCount}/${theaterId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setCount(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDatas();
  }, []);

  const totalRevenue = totalRevene.reduce(
    (acc, ticket) => acc + ticket.total,
    0
  );
  const movieCount = totalRevene.length;
  const UserCount = count?.map((cou) => cou.userCount);

  switch (type) {
    case "order":
      data = {
        title: "BOOKED USER",
        isMoney: false,

        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
        value: UserCount,
      };
      break;
    case "earning":
      data = {
        title: "MOVIE BOOKED",
        isMoney: true,

        icon: (
          <MovieIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
        value: movieCount,
      };
      break;
    case "balance":
      data = {
        title: "TOTAL REVENUE",
        isMoney: true,

        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
        value: `${totalRevenue} ₹`,
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <h4 style={{ color: "rgb(160, 160, 160)" }}>
          {theater?.application?.theatername}
        </h4>
        <span className="title">{data.title}</span>
        <span style={{ paddingLeft: "10px" }} className="counter">
          {data.value}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
        </div>
        {data.icon}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Widget;
