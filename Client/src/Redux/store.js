import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  movies: [],
  date: null,
  selectedMovie: null,
  setBookedDetails: null,
  getSeatInformation: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setSearchKey: (state, action) => {
      state.searchKey = action.payload.searchKey;
    },
    setMovies: (state, action) => {
      state.movies = action.payload.movies;
    },
    addMovie: (state, action) => {
      state.movies.push(action.payload.movie);
    },
    deleteMovie: (state, action) => {
      state.movies = state.movies.filter(
        (movie) => movie._id !== action.payload.id
      );
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload.selectedMovie;
    },
    setBookedDetails: (state, action) => {
      state.bookedDetails = action.payload.bookedDetails;
    },
    getSeatInformation: (state, action) => {
      state.seatInformation = action.payload.seatInformation;
    },
    setOtp: (state, action) => {
      state.otp = action.payload.otp;
    },
    setTempemail: (state, action) => {
      state.tempemail = action.payload.tempemail;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setDates: (state, action) => {
      state.date = action.payload.date;
    },
    handleSelectDate: (state, action) => {
      state.date = action.payload.date;
      state.day = action.payload.day;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setPosts,
  setPost,
  setUser,
  setMovie,
  setSearchKey,
  setMovies,
  addMovie,
  deleteMovie,
  setSelectedMovie,
  setBookedDetails,
  getSeatInformation,
  setTempemail,
  setOtp,
  setToken,
  setDates,
  handleSelectDate
} = authSlice.actions;
export default authSlice.reducer;
