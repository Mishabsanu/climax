import "./BookingDetail.scss";
import Navbar from "../../components/Navbar/Navbar";
import React from "react";
import { CinemasBody } from "../../components/BookTickets/CinemasBody";
import { Header } from "../../components/BookTickets/Header";
import { Filter } from "../../components/BookTickets/Filter";
import { useParams } from "react-router-dom";

const BookingDetails = () => {
  let { id: movieId } = useParams();

  const image =
    "https://a-static.besthdwallpaper.com/avengers-endgame-movie-wallpaper-2880x1800-25808_8.jpg";

  return (
    <div style={{ backgroundColor: "black", paddingBottom: 20 }}>
      <Navbar />
      <div
        className="bannner"
        style={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${image})`,
        }}
      >
        <Header moviId={movieId} />
      </div>
      <Filter moviId={movieId} />
      <CinemasBody moviId={movieId} />
    </div>
  );
};

export default BookingDetails;
