var verifyToken = require("../middleware/authusr");


const express = require("express");
const {
  UserSignup,
  userLogin,
  googleSignup,
  getMovies,
  searchMovie,
  addprofileinfo,
  getMovie,
  getOneTheater,
  getScreenShows,
  addReview,
  getReview,
  getAllCity,
  reservation,
  getQrCode,
  getUserHistory,
  deleteReview,
  cancelTicket,
  seatReserved,
  otpLogin,
  userOtpSend,
  getAllPoster,
  //  payment,
} = require("../controllers/user");
const { User } = require("../models/user");
const router = express.Router();

router.post("/", UserSignup);
router.post("/login", userLogin);
router.post("/googleSignup", googleSignup);
router.post("/otplogin/:email", otpLogin);
router.post("/editprofile",verifyToken,addprofileinfo);
router.post("/reviews", verifyToken, addReview);
router.post("/reservation/:id/:total/", verifyToken, reservation); 
router.post("/sendOtp", userOtpSend);

router.get("/MovieList", getMovies);
router.get("/getMovie/:id", getMovie);
router.get("/searchMovie/:key", searchMovie);
router.get("/getOneTheater", getOneTheater);
router.get("/getAllCity", getAllCity);
router.get("/getAllPoster", getAllPoster);
router.get("/getScreenShows/:id/:title",verifyToken, getScreenShows);
router.get("/getAllReview/:id",verifyToken, getReview);
router.get("/getQrcode",verifyToken, getQrCode);
router.get("/history/:id", verifyToken, getUserHistory);
router.get("/seatReserved/:id/:time/:movieId/:date",verifyToken, seatReserved);

router.delete("/deleteReview/:id/:date",verifyToken, deleteReview);
router.delete("/cancelTicket/:id", verifyToken, cancelTicket); 

module.exports = router;
