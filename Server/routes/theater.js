var verifyToken = require("../middleware/autThe");
const express = require("express");
const {
  theaterSignup,
  theaterLogin,
  addApplication,
  addscreens,
  getscreen,
  getMovies,
  addShow,
  getAllTheater,
  deletScreen,
  deleteShowInfo,
  editScreen,
  editSreenShow,
  getReservationDetails,
  getOnePaymentDetails,
  getOneBookinDetails,
  getAdmin,
  getAllmessageCount,
  getReservation,
  OnereservationDetails,
  getOneTheaterDayRevenue,
  TheaterUserCount,
  ReservationDetailsOneTheater,
  notificationCountTheater,
  getUnrededMessage,
  //  editApplications,
} = require("../controllers/theater");
const { Theater } = require("../models/Theater");
const router = express.Router();

router.route("/").post(theaterSignup);
router.post("/login", theaterLogin);
router.post("/application", verifyToken, addApplication); 
router.post("/addscreen", verifyToken, addscreens); 
router.post("/Screeninfo", verifyToken, getMovies); 
router.post("/editScreen", verifyToken, editScreen); 
router.post("/addShow", verifyToken, addShow); 
router.post("/editSreenShow/:id/:screenName/:moviName",verifyToken, editSreenShow); 

router.delete("/deleteShowInfo/:id/:theaterID", verifyToken, deleteShowInfo); 
router.delete("/deletScreen/:id/:screenname", verifyToken, deletScreen); 

router.get("/getAdmin",verifyToken, getAdmin);
router.get("/listMoveTheater",verifyToken, getMovies);
router.get("/notificationCountTheater/:id",verifyToken, notificationCountTheater);
router.get("/getUnrededMessage/:id",verifyToken, getUnrededMessage);
router.get("/getOneBookinDetails/:id",verifyToken, getOneBookinDetails);
router.get("/ReservationDetailsOneTheater/:id",verifyToken, ReservationDetailsOneTheater);
router.get("/getReservation/:id",verifyToken,getReservation);
router.get("/getOnePaymentDetails/:id",verifyToken,getOnePaymentDetails);
router.get("/getOneTheaterDayRevenue/:date/:id",verifyToken, getOneTheaterDayRevenue);
router.get("/OnereservationDetails/:id",verifyToken, OnereservationDetails);
router.get("/TheaterUserCount/:id",verifyToken, TheaterUserCount);
router.get("/ReservationDetails/",verifyToken, getReservationDetails);
router.get("/getscreen/:id",getscreen);
router.get("/getAllTheater",getAllTheater);



module.exports = router;
