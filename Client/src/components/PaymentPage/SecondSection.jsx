import React from "react";
import styles from "../../components/Styling/PaymentsPage.module.scss";
import { useLocation } from "react-router-dom";

function SecondSection() {
  const location = useLocation();
  const { search } = location;

  const searchParams = new URLSearchParams(location.search);

  // Access URL parameters

  const time = searchParams.get("time");
  const theaterId = searchParams.get("theaterId");
  const screenname = searchParams.get("screenname");
  const theatername = searchParams.get("theatername");
  const movieName = searchParams.get("movieName");
  const ticketList = location.state;

  if (ticketList && ticketList.silver) {
    const seat = ticketList.silver[0].seat;
   
  } 


  const handleChange = (e) => {};
  return (
    <div>
      <div
        style={{ backgroundColor: "black", color: "white" }}
        className={styles.summeryPart}
      >
        <div>Booking Summery</div>
        <div style={{ color: "white" }} className={styles.categories}>
          <div style={{ textTransform: "uppercase" }}>{movieName}</div>
          <div>
            <span style={{ color: "white" }}>
              Ticket({ticketList.silver.length})
            </span>
          </div>
        </div>
        <span style={{ color: "white" }}>{theaterId}</span>

        <div style={{ color: "white" }} className={styles.line}></div>
        <div style={{ color: "white" }} className={styles.categories}>
          <div>Sub total</div>
          <div>Rs. {ticketList.price + 28}</div>
        </div>

        <div style={{ fontSize: "12px", margin: "0 30px", fontWeight: "600" }}>
          Your current State is <a href="">kerala</a>
        </div>
        <div
          style={{ color: "white", backgroundColor: "red" }}
          className={styles.total}
        >
          <div>Amount Payable</div>
          <div>Rs. {ticketList.price + 28}</div>
        </div>

        <div className={styles.cancellation_policy}>
          You can cancel the tickets 20 min(s) before the show. Refunds will be
          done according to <a href="">Cancellation Policy</a>
        </div>
      </div>
    </div>
  );
}

export default SecondSection;
