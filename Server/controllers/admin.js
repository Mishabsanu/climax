var Loginvalidate = require("../utils/validate");
const { Admin, validate } = require("../models/admin");
const { User } = require("../models/user");
const { Theater } = require("../models/Theater");
const Movie = require("../models/Movie");
const Reservation = require("../models/ReservationModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const poster = require("../models/Poster");
const Message = require("../models/MessageModel");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
module.exports = {
  adminSignup: async (req, res) => {
    try {
      const { error } = validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const admin = await Admin.findOne({ email: req.body.email });
      if (admin)
        return res
          .status(409)
          .send({ message: "Admin with given email already Exist!" });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      await new Admin({ ...req.body, password: hashPassword }).save();
      res.status(201).send({ message: "Admin created successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  adminLogin: async (req, res) => {
    try {
      var { error } = Loginvalidate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      var admin = await Admin.findOne({ email: req.body.email });
      if (!admin)
        return res.status(401).send({ message: "Invalid Email or Password" });

      var validPassword = await bcrypt.compare(
        req.body.password,
        admin.password
      );
      if (!validPassword)
        return res.status(401).send({ message: "Invalid Emailor Password" });

      var token = admin.generateAuthToken();
      res.status(200).json({ token, admin });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getUsers: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    try {
      // const user = await User.find().select("-password");
      const user = await User.paginate({}, options);
      if (!user)
        return res
          .status(500)
          .json({ message: "didnt got users from database" });

      res.status(200).json({ message: "Success", user });
    } catch (error) {
      res.status(500).json({ message: "something went wrong" });
    }
  },

  getUserss: async (req, res) => {
    try {
      const user = await User.find().select("-password");

      if (!user)
        return res
          .status(500)
          .json({ message: "didnt got users from database" });

      res.status(200).json({ message: "Success", user });
    } catch (error) {
      res.status(500).json({ message: "something went wrong" });
    }
  },

  searchUser: async (req, res) => {
    try {
      const users = await User.find({
        $or: [
          {
            username: { $regex: req.params.key },
          },
          {
            email: { $regex: req.params.key },
          },
        ],
      });
      res.status(200).json({ message: "Sucess", users });
    } catch (error) {
      res.status(500).json({ message: "something went wrong" });
    }
  },

  getAllTheater: async (req, res) => {
    try {
      const companyData = await Theater.find().sort("-createdAt");

      res.json(companyData);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },

  getAllTheaters: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    try {
      const companyData = await Theater.paginate({}, options);
      res.json(companyData);
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },

  reservationDetails: async (req, res) => {
    try {
      const reservationDetails = await Reservation.find();

      res.json(reservationDetails);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getOneTheater: async (req, res) => {
    try {
      const theater = await Theater.findById(req.params.id);
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }

      res.json(theater);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getTheater: async (req, res) => {
    try {
      const companyData = await Theater.findOne({ Name: "USUFALI" });

      res.json(companyData);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  addmovies: async (req, res) => {
    try {
      const movieExists = await Movie.findOne({
        title: req.body.title,
      });

      if (movieExists) {
        return res.status(400).json({ message: "Movie already exists" });
      }
      const caseSensitiveExists = await Movie.findOne({
        title: {
          $regex: new RegExp("^" + req.body.title + "$", "i"),
        },
      });

      if (caseSensitiveExists) {
        return res.status(400).json({ message: "Movie already exists" });
      }

      const moviedata = await Movie(req.body).save();
      res.json({ moviedata, status: true });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getAllMovies: async (req, res) => {
    try {
      const movies = await Movie.find().sort("-createdAt");

      res.json(movies);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getMovie: async (req, res) => {
    const movieId = req.params.id;
    try {
      const movies = await Movie.findOne({ _id: Object(movieId) });

      res.json(movies);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  moviePoster: async (req, res) => {
    try {
      const upload = multer({
        storage: multer.diskStorage({
          destination: "./public/uploads/",
          filename: function (req, file, cb) {
            cb(null, req.imageName);
          },
        }),
      }).single("image");

      req.imageName = `${req.params.id}.jpg`;
      upload(req, res, (err) => {});

      res.json("done");
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  editMovie: async (req, res) => {
    const id = req.params.id;
    const output = {};

    if (req.body.datas.title) output.title = req.body.datas.title;
    if (req.body.datas.description)
      output.description = req.body.datas.description;
    if (req.body.datas.genre) output.genre = req.body.datas.genre;
    if (req.body.datas.director) output.director = req.body.datas.director;
    if (req.body.datas.duration) output.duration = req.body.datas.duration;
    if (req.body.datas.releasedate)
      output.releasedate = req.body.datas.releasedate;
    if (req.body.datas.imageUrl) output.imageUrl = req.body.datas.imageUrl;

    try {
      const movie = await Movie.findByIdAndUpdate(id, output);

      res.status(200).json(movie);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  deleteMovie: async (req, res) => {
    let id = req.params.id;

    try {
      const data = await Movie.findByIdAndRemove({ _id: id });
      const update=await Movie.find().sort("-createdAt");
      res.status(200).json(update);
    } catch (error) {}
  },

  deletePoster: async (req, res) => {
    let id = req.params.id;
    try {
      const data = await poster.findByIdAndRemove({ _id: id });
      const Allposter = await poster.find().sort({ createdAt: -1 });
      res.status(200).json(Allposter);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  addPoster: async (req, res) => {
    try {
      const newPoster = new poster({
        posterImageUrl: req.body.PosterImageUrl,
        PosterUrl: req.body.PosterUrl,
      });
      const savedPoster = await newPoster.save();
      const Allposter = await poster.find().sort({ createdAt: -1 });

      res.json({ Allposter, status: true });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getAllPoster: async (req, res) => {
    try {
      const Allposter = await poster.find().sort({ createdAt: -1 });
      res.json(Allposter);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  approve: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    try {
      let id = req.params.id;
      const user = await Theater.findByIdAndUpdate(
        { _id: Object(id) },
        { $set: { isApproved: true } }
      );
      const companyData = await Theater.paginate({}, options);
      res.json(companyData);

    
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
      //try later
    }
  },

  reject: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    try {
      let id = req.params.id;

      const user = await Theater.findByIdAndUpdate(
        { _id: Object(id) },
        { $set: { isApproved: false } }
      );
      const companyData = await Theater.paginate({}, options);
      res.json(companyData);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
      //try later
    }
  },

  blockStaff: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    try {
      let id = req.params.id;

      const user = await User.findByIdAndUpdate(
        { _id: Object(id) },
        { $set: { Block: true } }
      );
      console.log(user);
      const users = await User.paginate({}, options);
      console.log(users,'oooooo');
      res.json(users);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
      //try later
    }
  },

  unblockStaff: async (req, res) => {
    const pageNo = req.query.page;
    const options = {
      page: Number(pageNo) ?? 1,
      limit: 3,
      projection: {
        password: 0,
      },
    };
    let id = req.params.id;
    try {
      // const {id} = req.body
      const user = await User.findByIdAndUpdate(
        { _id: Object(id) },
        { $set: { Block: false } }
      );
      const users = await User.paginate({}, options);
      res.json(users);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
      //try later
    }
  },

  getLatestMessage: async (req, res) => {
    let userId = req.params.id;

    try {
      const message = await Message.findOne({ sender: userId })
        .sort({ createdAt: -1 })
        .select("createdAt")
        .lean();
      return res.json(message);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
      throw new Error("Failed to fetch latest message");
    }
  },

  getDailyRevenue: async (req, res) => {
    try {
      const DailyRevenue = await Reservation.aggregate([
        {
          $group: {
            _id: "$showDate",
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
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  getOneDayRevenue: async (req, res) => {
    try {
      const today = new Date(req.params.id); // get today's date
      const onDayRevenue = await Reservation.aggregate([
        {
          $match: {
            showDate: { $eq: req.params.id },
          },
        },
        {
          $group: {
            _id: null,
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
  getUnreadMEssageAllTheater: async (req, res) => {
    const id = req.params.id;
    const adminId = req.params.adminId;
    const objectId = mongoose.Types.ObjectId(id);
    const objectId1 = mongoose.Types.ObjectId(adminId);
    try {
      const unread = await Message.aggregate([
        {
          $match: {
            read: false,
            sender: objectId,
            recipient: objectId1,
          },
        },
        {
          $group: {
            _id: {
              sender: "$sender",
              recipient: "$recipient",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ]);
      res.json(unread);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" + error });
    }
  },

  readTrue: async (req, res) => {
    try {
      let id = req.params.id;
      let adminId = req.params.adminId;
      const objectId1 = mongoose.Types.ObjectId(id);
      const objectId = mongoose.Types.ObjectId(adminId);
      const readTrue = await Message.updateMany(
        { recipient: objectId, sender: objectId1 },
        { read: true }
      );
      const updatedMessage = await Message.findOneAndUpdate(
        { recipient: objectId, sender: objectId1, read: true },
        { $set: { read: true } },
        { new: true }
      );
      res.json(updatedMessage);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  readTrueTheater: async (req, res) => {
    try {
      let id = req.params.id;
      let theaterId = req.params.theaterId;
      const objectId = mongoose.Types.ObjectId(id);
      const objectId1 = mongoose.Types.ObjectId(theaterId);
      const readTrue = await Message.updateMany(
        { recipient: objectId1, sender: objectId },
        { read: true }
      );

      const updatedMessage = await Message.findOneAndUpdate(
        { recipient: objectId1, sender: objectId, read: true },
        { $set: { read: true } },
        { new: true }
      );

      res.json(updatedMessage);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  notificationCountAdmin: async (req, res) => {
    const adminId = req.params.id;
    const objectId = mongoose.Types.ObjectId(adminId);
    try {
      const unreadCount = await Message.countDocuments({
        recipient: objectId,
        read: false,
      });
      res.json(unreadCount);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  getUnrededMessage: async (req, res) => {
    const adminId = req.params.id;
    const objectId = mongoose.Types.ObjectId(adminId);
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
  AdmingetOnePaymentDetails: async (req, res) => {
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
  AdmingetReservationDetails: async (req, res) => {
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
};
