import React from "react";

const CastList = (props) => {
  const image =
    "https://a-static.besthdwallpaper.com/avengers-endgame-movie-wallpaper-2880x1800-25808_8.jpg";

  return (
    <div className="casts">
      <div className="casts__item">
        <div
          className="casts__item__img"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>
    </div>
  );
};

export default CastList;
