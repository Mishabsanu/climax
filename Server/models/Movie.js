const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    genre: {
      type: String,
    },
    director: {
      type: String,
    },
    duration: {
      type: String,
    },
    releasedate: {
      type: Date,
    },
    Review:{
      type:Array,
    },
    imageUrl: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
moviesSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEYMOVIE, {
    expiresIn: "7d",
  });
  return token;
};

const movies = mongoose.model("movies", moviesSchema);
module.exports = movies;
