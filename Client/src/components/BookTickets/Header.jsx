import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../Styling/Cinemas.module.scss";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import GradeIcon from "@mui/icons-material/Grade";
import { getMovie } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

export const Header = () => {
  let { id: movieId } = useParams();
  const [movie, getMoviee] = useState([]);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  useEffect(() => {
    getOneMovie();
  }, [movieId]);

  const getOneMovie = () => {
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
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  var currentDate = new Date(movie.releasedate);
  var formattedDate = currentDate.toLocaleDateString("en-US");

  return (
    <div className={styles.header__container}>
      <div className={styles.header_container__info}>
        <h1>{movie.title}</h1>
        <div>
          <div className={styles.header_container__info__grade}>A+</div>
          <div className={styles.header_container__info__rating}>
            <span style={{ color: "yellow" }}>
              <GradeIcon />
              <GradeIcon />
              <GradeIcon />
              <StarHalfIcon />
            </span>
          </div>
          <div className={styles.header_container__info__genre}>
            <div>{movie.genre}</div>
          </div>
          <div className={styles.header_container__info__date}>
            {formattedDate}
          </div>
          <div className={styles.header_container__info__duration}>
            {movie.duration}
          </div>
        </div>
      </div>
      <div className={styles.header__container__crew}>
        <h4>Cast & Crew</h4>
        <Carousel responsive={responsive} removeArrowOnDeviceType={["mobile"]}>
          <div className={styles.header__container__crew__item}>
            <img
              src="https://www.india.com/wp-content/uploads/2013/12/x-men-days.jpg"
              alt="person"
            />
            <br />
            <span>{movie.director}</span>
          </div>
        </Carousel>
      </div>
      <ToastContainer />
    </div>
  );
};
