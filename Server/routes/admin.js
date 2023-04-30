const express = require("express");
var verifyToken = require("../middleware/authadm");
const {
  adminLogin,
  getUsers,
  getUserss,
  searchUser,
  getAllTheater,
  getAllTheaters,
  reservationDetails,
  getTheater,
  addmovies,
  moviePoster,
  getAllMovies,
  editMovie,
  deleteMovie,
  addPoster,
  getMovie,
  getAllPoster,
  reject,
  approve,
  blockStaff,
  unblockStaff,
  getOneTheater,
  getLatestMessage,
  getDailyRevenue,
  getOneDayRevenue,
  getUnreadMEssageAllTheater,
  readTrue,
  readTrueTheater,
  notificationCountAdmin,
  getUnrededMessage,
  deletePoster,
  AdmingetOnePaymentDetails,
  AdmingetReservationDetails,
} = require("../controllers/admin");
const { Admin } = require("../models/admin");
const router = express.Router();

router.post("/login", adminLogin);
router.post("/addPoster",verifyToken, addPoster); 
router.post("/editMovie/:id",verifyToken, editMovie);
router.post("/addmovies", verifyToken, addmovies);
router.post("/upload-moviePoster/:id", moviePoster);

router.get("/searchUser/:key", searchUser);
router.get("/getTheater/:id", getTheater);
router.get("/getOnePaymentDetailss/:id",verifyToken,AdmingetOnePaymentDetails);
router.get("/ReservationDetailss/",verifyToken, AdmingetReservationDetails);
router.get("/getAllUsers",verifyToken, getUsers);
router.get("/getAllUserss",verifyToken, getUserss);
router.get("/getAllTheater",verifyToken, getAllTheater);
router.get("/getAllTheaters",verifyToken, getAllTheaters);
router.get("/reservationDetails",verifyToken, reservationDetails);
router.get("/movieList",verifyToken, getAllMovies);
router.get("/notificationCountAdmin/:id",verifyToken, notificationCountAdmin);
router.get("/getUnrededMessage/:id",verifyToken, getUnrededMessage);
router.get("/getDailyRevenue",verifyToken, getDailyRevenue);
router.get("/getOneDayRevenue/:id",verifyToken, getOneDayRevenue);
router.get("/latestMessage/:id", getLatestMessage);
router.get("/getAllPoster",verifyToken, getAllPoster);
router.get("/getOneTheater/:id", getOneTheater);
router.get("/getMovie/:id",verifyToken, getMovie);
router.get("/getUnreadMEssageAllTheater/:adminId/:id",getUnreadMEssageAllTheater);


router.patch("/readTrueTheater/:id/:theaterId", readTrueTheater); 
router.patch("/readTrue/:id/:adminId",verifyToken, readTrue);
router.patch("/unblock/:id",verifyToken, unblockStaff); 
router.patch("/block/:id",verifyToken, blockStaff); 
router.patch("/approveTheater/:id",verifyToken, approve); 
router.patch("/rejectTheater/:id",verifyToken, reject); 

router.delete("/deleteMovie/:id", verifyToken, deleteMovie); 
router.delete("/deletePoster/:id", verifyToken, deletePoster); 




module.exports = router;
