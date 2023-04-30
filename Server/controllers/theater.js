var Loginvalidate = require("../utils/validate");
const { Theater, validate } = require("../models/Theater");
const bcrypt = require("bcrypt");
const Movie = require("../models/Movie");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin");
const { ObjectId } = require("mongodb");
const Reservation = require("../models/ReservationModel");
const Message = require("../models/MessageModel");
const { types } = require("joi");
const mongoose = require("mongoose");
module.exports = {
  theaterSignup: async (req, res) => {
    try {
      const { error } = validate({
        Name: req.body.Name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone, // Add the phone field to the validation data
      });
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const theater = await Theater.findOne({ email: req.body.email });
      if (theater)
        return res
          .status(409)
          .send({ message: "Theater with given email already Exist!" });
      const theaters = await Theater.findOne({ phone: req.body.phone });
      if (theaters)
        return res
          .status(409)
          .send({ message: "Theater with given phone already Exist!" });

      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      await new Theater({ ...req.body, password: hashPassword }).save();
      res.status(201).send({ message: "theater created successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  theaterLogin: async (req, res) => {
    try {
      var { error } = Loginvalidate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      var theater = await Theater.findOne({ email: req.body.email });
      if (!theater)
        return res.status(401).send({ message: "Invalid Email or Password" });

      var validPassword = await bcrypt.compare(
        req.body.password,
        theater.password
      );
      if (!validPassword)
        return res.status(401).send({ message: "Invalid Emailor Password" });

      var token = theater.generateAuthToken();

      res.status(200).json({ token, theater });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  addApplication: async (req, res) => {
    const theaterId = req.body.theaterId;
    delete req.body.theaterId;
    const { theatername, state, place, discription, imageUrl, city } = req.body;

    try {
      let info = await Theater.updateOne(
        { _id: theaterId },
        { $set: { application: req.body.application } }
      );
      const updated = await Theater.findOne({ _id: theaterId });
      res.json({ id: info._id, status: true, updated });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getscreen: async (req, res) => {
    try {
      const theatreId = req.params.id;
      const screeninfo = await Theater.findOne({ _id: theatreId });

      res.json({ status: true, screeninfo });
    } catch (error) {}
  },

  addscreens: async (req, res) => {
    const { datas, userId } = req.body;

    try {
      const theater = await Theater.findOne({ _id: userId, isApproved: false }); // find a theater with isApproved=false

      if (theater) {
        return res.status(400).json({ message: "Theater is not approved" }); // return an error if isApproved=false
      }
      const screenExists = await Theater.findOne({
        _id: userId,
        screen: {
          $elemMatch: {
            screenname: {
              $regex: new RegExp("^" + datas.screenname + "$", "i"),
            },
          },
        },
      });

      if (screenExists) {
        return res.status(400).json({ message: "Screen already exists" });
      }
      const screeninfo = await Theater.updateOne(
        { _id: userId },
        { $addToSet: { screen: datas } }
      );
      const updated = await Theater.findOne({ _id: userId });

      res.json({ id: screeninfo._id, status: true, updated });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  addShow: async (req, res) => {
    try {
      const { datas, screenName } = req.body;
      const theaterId = req.body.theaterId;
      const theater = await Theater.findOne({ _id: Object(theaterId) });

      const screen = Object.values(theater.screen).find(
        (s) => s.screenname === screenName
      );
      if (!screen) {
        return res.status(404).json({ error: "Screen not found" });
      }

      if (!screen.shows) {
        screen.shows = []; // initialize the shows array
      }
      const { moviename, ticketPrice, time } = datas;
      const formattedTimes = time.map((t) => {
        const date = t.value;
        const formattedTime = date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return formattedTime;
      });

      const newShow = { moviename, ticketPrice, time: formattedTimes };
      screen.shows.push(newShow);
      Theater.findOneAndUpdate(
        {
          _id: Object(req.body.theaterId),
          "screen.screenname": req.body.screenName,
        },
        { $set: { "screen.$.show": screen.shows } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
      await theater.save();
      let updatedTheater = await Theater.findOne({ _id: Object(theaterId) });
      res.json({ status: "true", screen, updatedTheater });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getMovies: async (req, res) => {
    try {
      const movies = await Movie.find();
      res.json(movies);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getAllTheater: async (req, res) => {
    try {
      const companyData = await Theater.find().sort("-createdAt");
      res.json(companyData);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  deletScreen: async (req, res) => {
    const { id, screenname } = req.params;
    try {
      const data = await Theater.findByIdAndUpdate(
        id,
        { $pull: { screen: { screenname } } },
        { new: true }
      );
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  editScreen: async (req, res) => {
    try {
      const { datas, screen, theaterId } = req.body;

      if (
        !datas ||
        !datas.rows ||
        !datas.column ||
        !datas.screenname ||
        !screen ||
        !theaterId
      ) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid input data" });
      }

      const screenExists = await Theater.findOne({
        _id: theaterId,
        screen: {
          $elemMatch: {
            screenname: {
              $regex: new RegExp("^" + datas.screenname + "$", "i"),
            },
          },
        },
      });

      if (screenExists) {
        return res.status(400).json({ message: "Screen already exists" });
      }
      const screeninfo = await Theater.findOneAndUpdate(
        { _id: theaterId, "screen.screenname": screen },
        {
          $set: {
            "screen.$.rows": datas.rows,
            "screen.$.column": datas.column,
            "screen.$.screenname": datas.screenname,
          },
        },
        { new: true }
      );
      if (!screeninfo) {
        return res
          .status(404)
          .json({ status: false, message: "Screen not found" });
      }

      res.status(200).json({ status: true, screeninfo });
    } catch (error) {
      // Exception handling
      console.error(error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  },

  editSreenShow: async (req, res) => {
    const { id, screenName, moviName } = req.params;
    const { ticketPrice, moviename, time } = req.body.datas;

    try {
      const filter = {
        _id: new ObjectId(id),
        "screen.screenname": screenName,
        "screen.show.moviename": moviName,
      };

      const update = {
        $set: {
          "screen.$[screenElem].show.$[movieElem].ticketPrice": ticketPrice,
          "screen.$[screenElem].show.$[movieElem].moviename": moviename,
          "screen.$[screenElem].show.$[movieElem].time": time,
        },
      };

      const options = {
        arrayFilters: [
          { "screenElem.screenname": screenName },
          { "movieElem.moviename": moviName },
          // { 'movieElem.time': time  }
        ],
        returnOriginal: false,
      };

      const result = await Theater.findOneAndUpdate(filter, update, options);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
  getReservationDetails: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    try {
      const ReservationDetails = await Reservation.paginate({}, options);
      res.json(ReservationDetails);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getOnePaymentDetails: async (req, res) => {
    try {
      const paymentDetails = await Reservation.findById(req.params.id).sort(
        "-bookedDate"
      );
      if (!paymentDetails) {
        return res.status(404).json({ message: "paymentDetails not found" });
      }
      res.json(paymentDetails);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
  getOneBookinDetails: async (req, res) => {
    try {
      const bookingDetails = await Reservation.findById(req.params.id);
      if (!bookingDetails) {
        return res.status(404).json({ message: "bookingDetails not found" });
      }
      res.json(bookingDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAdmin: async (req, res) => {
    try {
      const admin = await Admin.find().select("-password");
      if (!admin)
        return res
          .status(500)
          .json({ message: "didnt got admin from database" });

      res.status(200).json({ message: "Success", admin });
    } catch (error) {
      res.status(500).json({ message: "something went wrong" });
    }
  },
  deleteShowInfo: async (req, res) => {
    const screenname = req.params.id;
    const theaterID = req.params.theaterID;

    try {
      const theater = await Theater.updateOne(
        { _id: theaterID, "screen.screenname": screenname },
        { $unset: { "screen.$.show": 1 } }
      );
      const updatedTheater = await Theater.findById(theaterID);

      res.status(200).json(updatedTheater);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  },

  getAllmessageCount: async (req, res) => {
    try {
      const count = await Message.countDocuments({});
      res.status(200).json({ count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get message count" });
    }
  },
  getReservation: async (req, res) => {
    const theaterId = req.params.id;
    try {
      const DailyRevenue = await Reservation.aggregate([
        {
          $match: { theaterId: new ObjectId(theaterId) },
        },
        {
          $group: {
            _id: "$showDate",
            count: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      res.json(DailyRevenue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  OnereservationDetails: async (req, res) => {
    const theaterId = req.params.id;

    try {
      const reservationDetails = await Reservation.find({
        theaterId: new ObjectId(theaterId),
      });
      res.json(reservationDetails);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
  getOneTheaterDayRevenue: async (req, res) => {
    try {
      const today = new Date(req.params.date); // get today's date
      const onDayRevenue = await Reservation.aggregate([
        {
          $match: {
            theaterId: new ObjectId(req.params.id),
            showDate: req.params.date,
          },
        },

        {
          $group: {
            _id: "$showDate",
            count: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
      ]);
      res.json(onDayRevenue);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
  TheaterUserCount: async (req, res) => {
    try {
      const OneTheateruserCount = await Reservation.aggregate([
        {
          $match: {
            theaterId: new ObjectId(req.params.id),
          },
        },

        {
          $group: {
            _id: "$theaterId",
            distinctUserIds: { $addToSet: "$userId" },
          },
        },
        {
          $project: {
            _id: 0,
            userCount: { $size: "$distinctUserIds" },
          },
        },
      ]);
      res.json(OneTheateruserCount);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  ReservationDetailsOneTheater: async (req, res) => {
    const theaterId = req.params.id;
    try {
      const bookingDetails = await Reservation.find({
        theaterId: new ObjectId(req.params.id),
      });
      if (!bookingDetails) {
        return res.status(404).json({ message: "bookingDetails not found" });
      }
      res.json(bookingDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  notificationCountTheater: async (req, res) => {
    const theaterId = req.params.id;
    const objectId = mongoose.Types.ObjectId(theaterId);
    try {
      const unreadCount = await Message.countDocuments({
        recipient: objectId,
        read: false,
      });
      res.json(unreadCount);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getUnrededMessage: async (req, res) => {
    const theaterId = req.params.id;
    const objectId = mongoose.Types.ObjectId(theaterId);
    try {
      const unredMessages = await Message.find({
        recipient: objectId,
        read: false,
      });
      res.json(unredMessages);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },
};
