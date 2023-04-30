import React from "react";
import styles from "../../components/Styling/Summery.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import PaymentsPage from "../../components/PaymentPage/index";
export default function SummaryPage() {
  const [proceed, setProceed] = React.useState(false);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  // Access URL parameters
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const theaterId = searchParams.get("theaterId");
  const screenname = searchParams.get("screenname");
  const theatername = searchParams.get("theatername");
  const movieName = searchParams.get("movieName");
  const movieId = searchParams.get("movieId");


  const ticketList = location.state;
 

  if (ticketList && ticketList.silver) {
    const seat = ticketList.silver[0].seat;
    console.log(seat);
  } else {
    console.log("silver tickets not found");
  }
  const handleProceed = () => {
    setProceed(true);
  };
  const datas = {
    date,
    time,
    theaterId,
    screenname,
    theatername,
    movieName,
    ticketList,
    movieId,
  };
  console.log(
    time,
    theaterId,
    screenname,
    theatername,
    movieName,
    "okkkkkkkkkkkkkkkkkkkkkkkk"
  );

  return (
    <div>
      <Navbar />
      <div style={{ height: "800px", backgroundColor: "black" }}>
        <div className={styles.container}>
          <img
            style={{ width: "600px" }}
            src="https://st3.depositphotos.com/9881890/17595/i/450/depositphotos_175959862-stock-photo-excited-woman-glasses-big-basket.jpg"
            alt=""
          />

          <div className={styles.summeryPart}>
            <div>Booking Summery</div>

            <div className={styles.categories}>
              <div style={{ textTransform: "uppercase" }}>
                screen :{theaterId}
              </div>
              <div> Rs. {ticketList.price}</div>
            </div>
            <br />
            <div className={styles.categories}>
              <div>
                <h5>SEAT</h5>
              </div>
              {ticketList.silver.map((ticket, index) => (
                <span key={index}>{ticket.seat} </span>
              ))}
            </div>
            <div>
              <span>Ticket({ticketList.silver.length})</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.categories}></div>
            <div className={styles.categories}>
              <div style={{ fontSize: "12px", lineHeight: "25px" }}>
                Internet handeling fees
              </div>
              <div>Rs 28.00</div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.categories}>
              <div>Sub total</div>
              <div>{ticketList.price + 28}</div>
            </div>

            <div
              style={{ fontSize: "12px" }}
              className={styles.categories}
            ></div>
            <div className={styles.charity}>
              <h5>Show Time : {time}</h5>
              <h5>Show Time : {date}</h5>
            </div>

            <div className={styles.total}>
              <div>Amount Payable</div>
              <div>Rs {ticketList.price + 28}</div>
            </div>

            <div onClick={handleProceed} className={styles.proceedBtn}>
              <div>Total : Rs {ticketList.price + 28}</div>
              <PaymentsPage allinfo={datas} proceed={proceed} />
            </div>
            <div className={styles.cancellation_policy}>
              You can cancel the tickets 20 min(s) before the show. Refunds will
              be done according to <a href="">Cancellation Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
