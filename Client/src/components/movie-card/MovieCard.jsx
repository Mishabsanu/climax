import Button from "@mui/material/Button";
import React from "react";
import "./movie-card.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { getMovies } from "../../utils/Constants";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMovies } from "../../Redux/store";
import { toast, ToastContainer } from "react-toastify";

const MovieCard = (props) => {
  const searchKey = useSelector((state) => state.searchKey);
  const [movies, getAllMovie] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMovieList();
  }, []);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const getAllMovieList = () => {
    axios
      .get(getMovies)
      .then((response) => {
        dispatch(setMovies({ movies }));

        getAllMovie(response.data);
      })
      .catch((error) => {
        if (error.response) {
          generateError(error.response.data.message);
        } else {
          generateError("Network error. Please try again later.");
        }
      });
  };

  return (
    <>
      <div className="card-container">
        {props.searchedMovies &&
          props.searchedMovies.map((movie, index) => {
            return (
              <Link
                to={`/MovieDetails/${movie._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="movie-card"
                  style={{ backgroundImage: `url(${movie.imageUrl})` }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Link style={{ textDecoration: "none" }}>
                      <h5 className="namemove">
                        {" "}
                        <Button variant="contained" color="error">
                          Book
                        </Button>
                        <br /> <br />
                        <br />
                        <h2>{movie.title}</h2> <br />
                        <br />
                        <span style={{ color: "red" }}>{movie.genre}</span>
                        <span style={{ paddingLeft: "20px", color: "yellow" }}>
                          {movie.duration}{" "}
                          <span style={{ color: "white" }}>min</span>
                        </span>
                      </h5>
                    </Link>
                  </div>
                </div>
              </Link>
            );
          })}
        {searchKey.length === 0 &&
          movies.map((movie, index) => {
            return (
              <Link
                to={`/MovieDetails/${movie._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="movie-card"
                  style={{ backgroundImage: `url(${movie.imageUrl})` }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Link
                      to={`/BokingDetails/${movie._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h5 className="namemove">
                        {" "}
                        <Button variant="contained" color="error">
                          Book
                        </Button>
                        <br />
                        <br /> <br />
                        <h2>{movie.title}</h2> <br />
                        <br />
                        <span style={{ color: "red" }}>{movie.genre}</span>
                        <span style={{ paddingLeft: "20px", color: "yellow" }}>
                          {movie.duration}{" "}
                          <span style={{ color: "white" }}>min</span>
                        </span>
                      </h5>
                    </Link>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <ToastContainer />
    </>
  );
};

export default MovieCard;
