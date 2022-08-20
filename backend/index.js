// @ts-check

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", async (req, res) => {
  res.status(200).send("Hello world");
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.removeAllListeners();

  socket.on("join", (data) => {
    onlineUsers[data.id] = socket.id;
  });

  socket.on("send_message", (data) => {
    let sendTo = onlineUsers[data.to];
    // socket.join(`${data.to}-${sendTo}`);
    if (sendTo) {
      socket.to(sendTo).emit("receive_message", {
        msg: data.msg,
        from: data.id,
        time: new Date().toISOString(),
      });
    }
  });
});

server.listen(5000, () => {
  console.log("SERVER IS RUNNING");
});
