const express = require("express");

const {
  addMessage,
  getAllMessage,

  
} = require("../controllers/messageController");
const Message = require("../models/MessageModel");
const router = express.Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;
