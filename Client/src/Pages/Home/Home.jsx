import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.scss";
import MovieList from "../../components/movie-list/MovieList";
import Banner from "../../components/Banner/Banner";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingBottom: "0px" }}>
        <Banner />
      </div>
      <div
        className=""
        style={{ backgroundColor: "black", paddingTop: "70px" }}
      >
        <h1 style={{ color: "white", paddingLeft: "100px" }}>
          EXPLORE NEW MOVIES
        </h1>
        <br />
      </div>
      <div className="movieslist">
        <MovieList />
      </div>
      <Footer />
    </>
  );
};

export default Home;
