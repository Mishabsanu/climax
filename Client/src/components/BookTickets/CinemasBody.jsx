import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import styles from "../Styling/Cinemas.module.scss";
import axios from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { getMovie, getScreenShows } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const CinemasBody = () => {
  const date = useSelector((state) => state.date);
  const token = useSelector((state) => state.token);
  let { id: movieId } = useParams();
  const [movies, getMoviee] = useState([]);
  const [theater, setTheater] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getOneMovie();
  }, [movieId]);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const getOneMovie = () => {
    try {
      axios
        .get(`${getMovie}/${movieId}`)
        .then((response) => {
          getMoviee(response.data);
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

  const moviId = movies._id;
  const moviTitle = movies.title;

  const fetchTheatreData = useCallback(() => {
    if (moviId && moviTitle) {
      axios
        .get(`${getScreenShows}/${movies._id}/${movies.title}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTheater(response.data.data);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    }
  }, [movies]);

  useEffect(() => {
    fetchTheatreData();
  }, [fetchTheatreData, movies]);

  useEffect(() => {}, [theater]);
  const theaterId = theater._id;
  const movieName = movies.title;

  const seatView = (
    time,
    theaterId,
    screenname,
    theatername,
    ticketPrice,
    movieName,
    movieId
  ) => {
    const dateString = date;
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const isoDate = year + "-" + month + "-" + day;

    navigate(
      `/booktickets/seats?date=${isoDate}&time=${time}&theaterId=${theaterId}&screenname=${screenname}&theatername=${theatername}&ticketPrice=${ticketPrice}&movieName=${movieName}&movieId=${movieId}`
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__info}>
        <div>
          <CircleIcon style={{ color: "#4ABD5D", fontSize: 10 }} />
          <span>AVAILABLE</span>
        </div>
        <div>
          <CircleIcon style={{ color: "rgb(253, 102, 0)", fontSize: 10 }} />
          <span>FAST FILLING</span>
        </div>
      </div>
      <div style={{ padding: "15px" }}>
        {theater.map((theaterData) => {
          return (
            <>
              <div className={styles.container__card}>
                <div className={styles.container__card__title}>
                  <FavoriteIcon
                    className={styles.container__card__title__icon}
                  />
                  <h4>{theaterData._id}</h4>
                </div>
                {theaterData.screens.map((screen) => {
                  return (
                    <div className={styles.container__card__info}>
                      <div className={styles.container__card__info__options}>
                        <div style={{ color: "#49BA8E" }}>
                          <SendToMobileIcon />
                          <span>M-Ticket</span>
                        </div>
                        <div style={{ color: "#FFB23F", paddingLeft: "30px" }}>
                          <FastfoodIcon />
                          <span>Food </span>
                        </div>
                      </div>
                      {screen.showInfo.map((showinfo) => {
                        return (
                          <>
                            {showinfo.map((data) => {
                              return (
                                <div
                                  className={
                                    styles.container__card__info__times__container
                                  }
                                >
                                  <div style={{ display: "flex" }}>
                                    {Array.isArray(data.time) &&
                                      data.time.map((time) => {
                                        return (
                                          <div
                                            style={{
                                              pointerEvents: "all",
                                              color: "white",
                                            }}
                                            className={styles.button}
                                            onClick={() =>
                                              seatView(
                                                time,
                                                screen.screenname,
                                                screen.theaterId,
                                                theaterData._id,
                                                data.ticketPrice,
                                                data.moviename,
                                                movieId
                                              )
                                            }
                                          >
                                            <div
                                              style={{
                                                border: "1px solid black",
                                                padding: "5px",
                                                marginRight: "10px",
                                              }}
                                            >
                                              {time}
                                            </div>

                                            <div
                                              className={
                                                styles.price__container
                                              }
                                            >
                                              <div
                                                style={{ alignItems: "center" }}
                                              >
                                                <p>Rs.{data.ticketPrice}</p>
                                                <span>{data.moviename}</span>
                                                <span
                                                  style={{ color: "#4abd5d" }}
                                                >
                                                  Available
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CircleIcon
                                      style={{
                                        color: "#FFC610",
                                        fontSize: 8,
                                        marginRight: 5,
                                      }}
                                    />{" "}
                                    <span
                                      style={{ fontSize: 12, color: "gray" }}
                                    >
                                      Cancellation Available
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
};
