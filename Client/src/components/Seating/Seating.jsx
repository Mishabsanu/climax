import React, { useEffect, useState } from "react";
import "./Seating.scss";
import { rows } from "../data";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Navbar/Navbar";
import { useLocation } from "react-router-dom";
import axios from "../../utils/axios";
import { seatReserved } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
const Silver = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ticketList = {
  silver: [],
  price: 0,
};

function Seating({
  seatingActive = false,

  type1 = "SILVER",
}) {
  const location = useLocation();
  const { search } = location;
  const searchParams = new URLSearchParams(location.search);
  const token = useSelector((state) => state.token);
  // Access URL parameters
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const theaterId = searchParams.get("theaterId");
  const screenname = searchParams.get("screenname");
  const theatername = searchParams.get("theatername");
  const ticketPrice = searchParams.get("ticketPrice");
  const movieName = searchParams.get("movieName");
  const movieId = searchParams.get("movieId");

  const [active, setActive] = React.useState(false);
  const [rowsData, setRowData] = useState(rows);

  const [seatActive, setSeatActive] = React.useState(seatingActive);
  const [price, setPrice] = React.useState(0);

  const navigate = useNavigate();
  const [check, SetCheck] = useState([]);
  const user = useSelector((state) => state.user);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  useEffect(() => {
    try {
      async function getHistroy() {
        const { data } = await axios.get(
          `${seatReserved}/${screenname}/${time}/${movieId}/${date}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        SetCheck(data);
      }
      getHistroy();
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  }, []);
  if (check?.seats) {
    const seatNumbers = check?.seats.map((seat) => seat);
  }

  if (check?.seats) {
    const seatNumbers = check?.seats.map((seat) => seat.id);

    if (seatNumbers.length >= 1) {
      rowsData.forEach((obj) => {
        const isReserved = seatNumbers.includes(obj.id);
        obj.isReserved = isReserved;
      });
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleClick = (value) => {
    setRowData(
      rowsData.map((e) =>
        e.id === value ? { ...e, isSelected: !e.isSelected } : e
      )
    );
  };

  React.useEffect(() => {
    let a = rowsData.filter((e) => e.isSelected).length;

    setPrice(a * ticketPrice);
    setActive(price > 0 ? true : false);
  }, [price, rowsData]);

  const handleSeat = () => {
    rowsData.forEach((e) =>
      e.isSelected
        ? ticketList.silver.push({ seat: e.seat, id: e.id, isReserved: true })
        : ""
    );

    ticketList.price = price;
    setSeatActive(false);
    navigate(
      `/booktickets/summary?time=${time}&theaterId=${theaterId}&date=${date}&screenname=${screenname}&theatername=${theatername}&ticketPrice=${ticketPrice}&movieName=${movieName}&movieId=${movieId}`,
      { state: ticketList }
    );
  };

  return (
    <>
      <Navbar />

      <div className="seatingModal__seatContainer">
        <div>
          <h1>{theatername}</h1>
          <span>{date}</span>
          <span style={{ paddingLeft: "20px" }}>{time}</span>
          <span style={{ paddingLeft: "20px" }}>{theatername}</span>
          <span style={{ paddingLeft: "20px" }}>{screenname}</span>
          <span style={{ paddingLeft: "20px" }}>{ticketPrice}</span>
          <span style={{ paddingLeft: "20px" }}>{movieName}</span>
          <span style={{ paddingLeft: "20px" }}>{theaterId}</span>
          <span style={{ paddingLeft: "20px" }}>{movieId}</span>

          <div className="seatingModal__seatContainer_can">
            <div style={{ display: "grid" }}>
              {Silver.map((e) => (
                <div style={{ margin: 10, color: "gray" }} key={e}>
                  {e}
                </div>
              ))}
            </div>
            <div className="seatingModal__seatContainer_seats">
              {rowsData?.map((e) => {
                return (
                  <div
                    onClick={() => handleClick(e.id)}
                    className={
                      e.disable
                        ? "disable"
                        : e.isReserved
                        ? "reserved"
                        : e.isSelected
                        ? "select"
                        : "seats"
                    }
                    key={e.id}
                  >
                    <p>{e.number}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="Screen">
            <img style={{ width: "420px" }} src="/raeesfeed.PNG" alt="screen" />
          </div>
          <div></div>
        </div>
      </div>
      <div
        style={active ? { display: "block" } : { display: "none" }}
        className="PriceButton"
      >
        <button
          onClick={() => handleSeat()}
          style={{
            height: 40,
            margin: 10,
            marginLeft: "40%",
            cursor: "pointer",
          }}
        >
          Pay Rs.{price}
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default Seating;
