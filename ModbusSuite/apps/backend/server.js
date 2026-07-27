const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const { initializeSocket } = require("./socket");

// ===============================
// DUMMY SERVICE
// ===============================
const {
    startDummyPolling,
    resetProductionDummy
} = require("./dummy.service");

// ===============================
// REAL MODBUS SERVICE
// ===============================
const {
    connectRealModbus,
    resetProductionReal
} = require("./realmodbus.service");

// ===============================
// CONFIGURATION
// ===============================
const USE_DUMMY_DATA = true
// true  -> Dummy Service
// false -> Real PLC

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        status: "Server Running",
        mode: USE_DUMMY_DATA ? "DUMMY" : "REAL"
    });

});

const server = http.createServer(app);

const io = new Server(server, {

    cors: {
        origin: "*"
    }

});

initializeSocket(io);

/*
====================================
Start Selected Data Source
====================================
*/

async function startDataSource() {

    if (USE_DUMMY_DATA) {

        console.log("\n====================================");
        console.log("MODE : DUMMY DATA");
        console.log("====================================");

        startDummyPolling();

    } else {

        console.log("\n====================================");
        console.log("MODE : REAL MODBUS PLC");
        console.log("====================================");

        await connectRealModbus();

    }

}

/*
====================================
Reset Selected Data Source
====================================
*/

function resetProduction() {

    if (USE_DUMMY_DATA) {

        resetProductionDummy();

    } else {

        resetProductionReal();

    }

}

/*
====================================
Socket Events
====================================
*/

io.on("connection", (socket) => {

    console.log("Frontend Connected");

    socket.on("reset-system", () => {

        console.log("\n====================================");
        console.log("RESET REQUEST FROM DASHBOARD");
        console.log("====================================");

        resetProduction();

        socket.emit("system-reset-complete");

    });

    socket.on("disconnect", () => {

        console.log("Frontend Disconnected");

    });

});

/*
====================================
Start Server
====================================
*/

server.listen(3000, async () => {

    console.log("\n====================================");
    console.log("Server Running On Port 3000");
    console.log("====================================");

    await startDataSource();

});