import React, { useEffect, useState } from "react";
import "./Ticket.scss";
import axios from "../../utils/axios";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { BookingHitory, cancelTicket } from "../../utils/Constants";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
const Ticket = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [history, sethistory] = useState([]);

  const user = useSelector((state) => state.user);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  useEffect(() => {
    try {
      async function getHistroy() {
        const { data } = await axios.get(`${BookingHitory}/${user._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        sethistory(data);
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "black",
      color: "white",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${cancelTicket}/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            sethistory(response.data);
            navigate("/booking");

            Swal.fire({
              title: "Deleted!",
              text: "Your review has been deleted.",
              icon: "success",
              background: "black",
              color: "white",
            });
            window.location.reload();
          })
          .catch((error) => {
            if (error.response) {
              generateError(error.response.data.message);
            } else {
              generateError("Network error. Please try again later.");
            }
          });
      }
    });
  };

  return (
    <>
      <Navbar />
      {history.length > 0 ? (
        history.map((item) => (
          <div className="singles">
            <div className="singleContainer">
              <div className="top">
                <div className="left">
                  <div style={{ color: "red" }}>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      variant="outlined"
                      color="error"
                    >
                      CANCEL TICKET
                    </Button>
                  </div>
                  <br />
                  <div className="item">
                    <div className="details">
                      <h1 style={{ color: "red" }}>{item?.movieName}</h1>
                      <br />

                      <div className="detailItem">
                        <span className="itemKey">THEATER: </span>
                        <span className="itemValue">{item?.theaterName}</span>
                      </div>

                      <div className="detailItem">
                        <span className="itemKey">SCREEN:</span>
                        <span className="itemValue">{item?.cinemaScreen}</span>
                      </div>

                      <div className="detailItem">
                        <span className="itemKey">Booked Date:</span>
                        <span className="itemValue">{item?.bookedDate}</span>
                      </div>

                      <div className="detailItem">
                        <span className="itemKey">Show Date:</span>
                        <span className="itemValue">{item?.showDate}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">SHOW:</span>
                        <span className="itemValue">{item?.startAt}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">PaymentId:</span>
                        <span className="itemValue">{item?.paymentId}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Booking ID:</span>
                        <span className="itemValue">{item?._id}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">TikectCount:</span>
                        <span className="itemValue">{item?.TikectCount}</span>
                      </div>

                      <span className="itemKey">Seats:</span>
                      {item?.seats?.map((dataSeat, index) => (
                        <div className="detailItem">
                          <span key={index} className="itemValue">
                            {dataSeat.seat},
                          </span>
                        </div>
                      ))}
                      <div className="detailItem">
                        <span className="itemKey">Ticket Price:</span>
                        <span className="itemValue">{item?.ticketPrice}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Total:</span>
                        <span className="itemValue">{item?.total}</span>
                      </div>
                    </div>

                    <img src={item?.qrcode} alt="" className="itemImg" />
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        ))
      ) : (
        <div
          style={{ backgroundColor: "black", width: "100%", height: "800px" }}
        >
          <h2
            style={{
              color: "white",
              paddingTop: "300px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Please book your ticket to see the booking details.
          </h2>

          <a
            style={{
              textDecoration: "none",
              paddingLeft: "10px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "50px",
              color: "red",
            }}
            href="/"
          >
            BOOK NOW
          </a>
        </div>
      )}
    </>
  );
};

export default Ticket;
