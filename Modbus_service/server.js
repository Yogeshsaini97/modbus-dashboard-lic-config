const express = require("express");

const http = require("http");

const cors = require("cors");

const { Server } = require("socket.io");

const { initializeSocket } = require("./socket");

// DUMMY DATA
const { startDummyPolling } = require("./dummy.service");

// REAL MODBUS
const { connectRealModbus } = require("./realmodbus.service");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

  res.json({
    status: "Server Running"
  });

});

const server = http.createServer(app);

const io = new Server(server, {

  cors: {
    origin: "*"
  }

});

initializeSocket(io);

io.on("connection", (socket) => {

  console.log("Frontend Connected");

  socket.on("disconnect", () => {

    console.log("Frontend Disconnected");

  });

});

server.listen(3000, async () => {

  console.log("Server Running On Port 3000");

  // =========================================
  // USE DUMMY DATA
  // =========================================

  startDummyPolling();

  // =========================================
  // USE REAL MODBUS
  // =========================================

//   await connectRealModbus();

});