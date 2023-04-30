require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./db");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const theaterRoutes = require("./routes/theater");
const MessageRouter = require('./routes/MessageRoutes')
app.get('/',(req,res)=>{
  res.send("working fineeeeeeeeee")
})
const socket = require("socket.io");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors({
  origin:[`${process.env.climaxflix}`,`${process.env.climaxadmin}`,`${process.env.climaxtheater}`],
  methods:"GET,PUT,PATCH,POST,DELETE",

}))
app.use(morgan("common"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const io = socket(server,{
    cors:{
      origin:[`${process.env.climaxflix}`,`${process.env.climaxadmin}`,`${process.env.climaxtheater}`],

    }
})
                                


const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    console.log("in send mesg", data);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });



  // for actual users
  // add user to online users array on connection
  socket.on('newUser', (userId) => {
    addUser(userId, socket.id);
    console.log('actual ',actualUsers)
  });

  socket.on("setBlocked",(data)=>{
    console.log('blooooooooo***************')
    const receiver = getUser(data.receiverId)
    console.log('blockeeeeeeeeeeeeeee ',receiver)
    if(receiver){
      io.to(receiver.socketId).emit('getBlocked');
    }
  })


});


// routes
app.use("/api/theater", theaterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/message', MessageRouter);












// helper functions for managing online users array
let actualUsers = [];

const addUser = (userId, socketId) => {
  if (!actualUsers.some((user) => user._id === userId)) {
    actualUsers.push({ _id: userId, socketId });
  }
};

const removeUser = (socketId) => {
  actualUsers = actualUsers.filter((user) => user.socketId !== socketId);
};


const getUser = (userId) =>{
  return actualUsers.find(user => user._id == userId); 
}