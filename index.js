// const { Server } = require("socket.io");
// const http = require("http");

// // Create HTTP server
// const app = http.createServer();

// const io = new Server(app, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });





// // Get user by ID


// // Handle new connections
// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Add user on new connection
//   socket.on("newUser", ({ userId, code }) => {
//     if (userId && code) {
//       addUser(userId, code, socket.id);
//     } else {
//       console.log("newUser event missing userId or code");
//     }
//   });

//   // Handle sending messages
//   socket.on("sendMessage", ({ receiverId, data, code }) => {
//     console.log(`Message from ${socket.id} to ${receiverId}:`, data);

//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage",data);

//     // if (receiver) {
//     //   socket.to(receiver.socketId).emit("getMessage", );
//     //   console.log(`Message sent to ${receiverId} (Socket ID: ${receiver.socketId})`);
//     // } else {
//     //   console.log(`Receiver ${receiverId} not found.`);
//     // }
//   });

//   // Handle disconnects
//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// // Start the server
// try {
//   app.listen(8000, () => {
//     console.log("Server running on port 8000");
//   });
// } catch (error) {
//   console.error("Error starting the server:", error.message);
// }



import express from 'express'
const port = 8000;
import { Server } from 'socket.io';
import { createServer } from 'http'
// import { cors } from 'cors'

const app = express();
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// app.use(cors())

let onlineUser = [];

const addUser = (code, socketId) => {
  const userExists = onlineUser.find((user) => user.socketId === socketId && user.code === code);
  if (!userExists) {
    onlineUser.push({ socketId, code });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};


const getUser = (socketId) => {
  const user = onlineUser.find((user) => user.socketId === socketId);
  return user;
};

io.on('connection', (socket) => {

  // socket.emit("welcome", "welcome to server")

  socket.on("newUser", ({ code }) => {
    addUser(code, socket.id)
  })

  socket.on("message", ({ data, socketid, code }) => {
    const receiveuser = getUser(socketid)
    if (receiveuser) {
      io.emit("recive", { data, socketid, code })
    }
  })

  socket.on("disconnect", () => {
    removeUser(socket.id);

  })

})


server.listen(port, () => {
  console.log(`server start ${port}`);

})