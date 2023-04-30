import React, { useEffect, useState } from "react";

import "./detail.scss";
import CastList from "./CastList";
import MovieList from "../../components/movie-list/MovieList";
import Navbar from "../../components/Navbar/Navbar";
import axios from "../../utils/axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating/Rating";
import ReviewModel from "../../components/Review/Review";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import ShowReview from "../../components/Review/showReview";
import { Box, Divider } from "@mui/material";
import Swal from "sweetalert2";
import { getAllReview, getMovie } from "../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
const Detail = () => {
  let { id: movieId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [open, setOpen] = React.useState(false);
  const [submit, setsubmit] = useState(false);
  const [review, setreview] = useState();
  const [movies, getMoviee] = useState([]);

  const handleOpen = () => {
    if (user?.username) {
      setOpen(true);
    } else {
      Swal.fire({
        title: "Please login to book your tickets",
        icon: "warning",
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        background: "black",
        color: "white",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  useEffect(() => {
    getOneMovie();
  }, [movieId]);

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

  const getReview = async () => {
    const { data } = await axios.get(`${getAllReview}/${movieId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setreview(data);
  };

  useEffect(() => {
    getReview();
  }, [submit]);

  const ratings = movies.Review?.map((review) => review.rating);

  const totalRatings = ratings?.reduce((acc, rating) => acc + rating, 0);

  const averageRating = totalRatings / ratings?.length;

  const ratingPercentage = averageRating * 100; // calculate the rating percentage out of 100

  const image =
    "https://a-static.besthdwallpaper.com/avengers-endgame-movie-wallpaper-2880x1800-25808_8.jpg";

  return (
    <div style={{ backgroundColor: "black" }}>
      <Navbar />
      <>
        <div
          className="bannner"
          style={{ width: "100%", backgroundImage: `url(${image})` }}
        ></div>
        <div className="mb-3 movie-content container">
          <div className="movie-content__poster">
            <div
              className="movie-content__poster__img"
              style={{ backgroundImage: `url(${movies?.imageUrl})` }}
            ></div>
          </div>
          <div className="movie-content__info">
            <h1 className="title">{movies?.title}</h1>
            <div className="genres">
              <span className="genres__items">{movies?.genre}</span>
            </div>

            <div className="cast">
              <div className="section__header">
                <h2>{movies?.director}</h2>
              </div>
              <br />
              {!!ratingPercentage && (
                <Rating
                  value={ratingPercentage}
                  ratingPercentage={averageRating.toFixed(1)}
                />
              )}
              <CastList />
            </div>
            <div className="genres">
              <Link
                to={`/BokingDetails/${movieId}`}
                style={{ textDecoration: "none" }}
              >
                <span className="genres__item">BOOK MOVIE TICKET</span>
              </Link>
            </div>
            <div className="movieDetails">
              <div className="details text-white mt-5 max-w-4xl">
                <h2 className="text-2xl font-bold">About the Movie</h2>
                <br />
                <br />
                <p>"{movies?.description}"</p>
              </div>
              <br />
              <div className="lines mb-4"></div>
              <div className="details text-white">
                <div className=" rate flex justify-between bg-gray-800 py-2 rounded-xl max-w-max">
                  <div className="review px-1 rounded flex flex-col justify-center">
                    <h3 className="text-lg m-0 font-medium">
                      Add your rating & review
                    </h3>

                    <p className="m-0 font-normal text-base text-gray-300">
                      Your rating matters
                    </p>
                  </div>
                  <div style={{ paddingTop: "13px", paddingLeft: "10px" }}>
                    <Button
                      className="BTS"
                      variant="contained"
                      color="error"
                      style={{ cursor: "pointer" }}
                      onClick={handleOpen}
                    >
                      Rate now
                    </Button>
                  </div>
                  <ReviewModel
                    open={open}
                    setOpen={setOpen}
                    setsubmit={setsubmit}
                  />
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
        <Box>
          {movies ? (
            <ShowReview
              movieReviews={review}
              movieInfo={movies}
              submit={submit}
            />
          ) : (
            ""
          )}
          <Divider
            sx={{
              display: { xs: "block", md: "none" },
            }}
          />
        </Box>

        <div className="container">
          <div className="section mb-3">
            <MovieList type="similar" />
          </div>
        </div>
      </>
      <ToastContainer />
    </div>
  );
};

export default Detail;
