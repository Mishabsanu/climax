
const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theaters",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
   
    },
    recipientName: {
      type: String,
      required: true,

     
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const Message = mongoose.model("Messages", MessageSchema);
module.exports = Message;
