const Message = require("../models/MessageModel");
const { Admin } = require("../models/admin");
const { Theater } = require("../models/Theater");

module.exports = {
  addMessage: async (req, res, next) => {
    try {
      const { from, to, message, recipientName, senderName } = req.body;

      const data = await Message.create({
        message: { text: message },
        users: [from, to],
        sender: from,
        recipient: to,
        recipientName: recipientName,
        senderName: senderName,
      });

      if (data) return res.json({ msg: "message added successfully" });
      return res.json({ msg: "failed to add message to database" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  getAllMessage: async (req, res, next) => {
    try {
      const { from, to } = req.body;

      const messages = await Message.find({ users: { $all: [from, to] } }).sort(
        { createdAt: 1 }
      );
      const projectMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
          send: msg.createdAt,
        };
      });

      res.json(projectMessages);
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  getAdmin: async (req, res, next) => {
    try {
      const users = await Admin.find({}).select(["email", "name", "_id"]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  },

  getTheater: async (req, res, next) => {
    try {
      const users = await Theater.find({}).select(["email", "theater", "_id"]);
      return res.json(users);
    } catch (ex) {
      next(ex);
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
      res.status(500).send({ message: "Internal Server Error" });
      throw new Error("Failed to fetch latest message");
    }
  },
};
