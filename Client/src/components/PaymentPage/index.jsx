import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import FirstSection from "./FirstSection";
import styles from "../../components/Styling/PaymentsPage.module.scss";
import SecondSection from "./SecondSection";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import axios from "../../utils/axios";
import { useState } from "react";
import { useEffect } from "react";
import { getQrcodes, reservation } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Counter = () => (
  <CountdownCircleTimer
    isPlaying
    duration={600}
    colors={[
      ["#004777", 0.33],
      ["#F7B801", 0.33],
      ["#A30000", 0.33],
    ]}
  >
    {({ remainingTime }) =>
      Math.floor(remainingTime / 60) + " : " + (remainingTime % 60) + " Minutes"
    }
  </CountdownCircleTimer>
);

function PaymentsPage({ proceed, allinfo }) {
  const location = useLocation();
  const { search } = location;
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
  }
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const [state, setState] = React.useState(false);
  const [counter, setCounter] = React.useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleClose = () => {
    setState(false);
  };

  const handlePayment = (id) => {
    try {
      setState(true);

      const seats = ticketList.silver.map(({ seat }) => seat);

      const total = ticketList.price + 28;
      const paymentId = id;
      const data = {
        ticketPrice: ticketList.price,
        userId: user._id,
        Email: user.email,
        userName: user.username,
        showDate: date,
        bookedDate: new Date(),
        paymentId: id,
        movieName: movieName,
        theaterId: screenname,
        cinemaScreen: theaterId,
        startAt: time,
        seats: ticketList.silver,
        theaterName: allinfo.theatername,
        total: ticketList.price + 28,
        TikectCount: ticketList.silver.length,
        movieId: allinfo.movieId,
      };

      axios
        .post(
          `${reservation}/${paymentId}/${total}`,
          { data },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {})
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });

      setTimeout(() => {
        setCounter(false);
      }, 2000);
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
  const handleMove = () => {
    navigate("/");
  };

  const [qrcode, getQrcode] = useState([]);
  useEffect(() => {
    getOneQecode();
  }, [movieId]);

  const getOneQecode = () => {
    try {
      axios
        .get(`${getQrcodes}/${movieId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          getQrcode(response.data);
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

  const STRIPE_PUBLISHABLE_KEY =
    "  pk_test_51MrveKSEuSYAWHWKcIceVaOttrBepl1kgOwHCuv10hcZgpQ21aJIgFvkMw9QOOiau5HkTGxL6S03Zj9obusn5yjy00EOFuWjYJ";

  const stripeTestPromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

  return (
    <div>
      <Dialog
        fullScreen
        open={proceed}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: "relative", backgroundColor: "black" }}>
          <Toolbar>
            <Typography variant="h6" style={{ flex: 1 }}>
              <svg height="40" width="150" color="white">
                <Link to="/"></Link>
              </svg>
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={styles.page}>
          <div className={styles.firstSection}>
            <Elements stripe={stripeTestPromise}>
              <FirstSection handlePayment={handlePayment} />
            </Elements>
          </div>
          <div className={styles.secondSection}>
            <SecondSection />
            <div
              style={{
                width: "80px",
                color: "red",
                margin: "20px auto",
                fontSize: "20px",
                wordBreak: "break-word",
              }}
            >
              <Counter />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={state}
        TransitionComponent={Transition}
      >
        {counter && (
          <DialogTitle
            id="customized-dialog-title"
            style={{ background: "#F84464", color: "white" }}
            onClose={handleClose}
          >
            Please hold tight we are getting your tickets ready.
          </DialogTitle>
        )}
        <DialogContent dividers>
          {/* <img style={{width:'100%'}} src=""/> */}
          {counter ? (
            <img style={{ width: "70%", margin: "0 15%" }} src="" alt="" />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "white",
                backgroundColor: "black",
                padding: "100px 50px",
                borderRadius: "5px",
              }}
            >
              {/* <img src={qrcode} alt="hello ser" /> */}
              <img
                style={{ width: "200px", height: "200px" }}
                src="https://www.investopedia.com/thmb/hJrIBjjMBGfx0oa_bHAgZ9AWyn0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/qr-code-bc94057f452f4806af70fd34540f72ad.png"
                alt="hello ser"
              />
              <h1>Congratulations!</h1>
              <div style={{ fontSize: "20px" }}>We have got your tickets</div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleMove}
            variant="contained"
            color="error"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </div>
  );
}

export default PaymentsPage;
