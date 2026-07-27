const ModbusRTU = require("modbus-serial");
const { emitModbusData } = require("./socket");

const client = new ModbusRTU();

/*
-----------------------------------------
Production Tracking
-----------------------------------------
*/
let totalPipeLength = 0;


let resetRequested = false;

let pollingTimer = null;

const CONFIG = {

    // CONNECTION TYPE
    connectionType: "TCP", // "TCP" or "RTU"

    // TCP SETTINGS
    tcp: {
        host: "192.168.3.250",
        port: 502
    },

    // SERIAL SETTINGS
    serial: {
        port: "COM2",
        baudRate: 9600,
        dataBits: 8,
        parity: "none",
        stopBits: 1
    },

    // COMMON
    slaveId: 1,

    pollingInterval: 60000

};

async function connectRealModbus() {

    try {

        console.log("================================");
        console.log("Connecting PLC...");
        console.log("================================");

        if (CONFIG.connectionType === "TCP") {

            console.log("Connection Type : TCP/IP");

            await client.connectTCP(

                CONFIG.tcp.host,

                {

                    port: CONFIG.tcp.port

                }

            );

        } else {

            console.log("Connection Type : Serial (RTU)");

            await client.connectRTUBuffered(

                CONFIG.serial.port,

                {

                    baudRate: CONFIG.serial.baudRate,

                    dataBits: CONFIG.serial.dataBits,

                    parity: CONFIG.serial.parity,

                    stopBits: CONFIG.serial.stopBits

                }

            );

        }

        client.setID(CONFIG.slaveId);

        console.log("✅ PLC Connected");

        if (CONFIG.connectionType === "TCP") {

            console.log(`Host     : ${CONFIG.tcp.host}`);
            console.log(`Port     : ${CONFIG.tcp.port}`);

        } else {

            console.log(`COM Port : ${CONFIG.serial.port}`);
            console.log(`BaudRate : ${CONFIG.serial.baudRate}`);

        }

        console.log(`Slave ID : ${CONFIG.slaveId}`);

        startPolling();

    }

    catch (error) {

        console.log("❌ Connection Failed");

        console.log(error.message);

        reconnect();

    }

}

async function pollMachineData() {

    try {

        /*
        -----------------------------------------
        Read Holding Registers
        -----------------------------------------
        */

        const holdingRegisters =
            await client.readHoldingRegisters(500, 11);

        /*
        -----------------------------------------
        Read Current Pipe Length (40120)
        -----------------------------------------
        */

        const currentPipeRegister =
            await client.readHoldingRegisters(120, 1);

        /*
        -----------------------------------------
        Read Machine Status
        -----------------------------------------
        */

        const coils =
            await client.readCoils(0, 1);

        const machineStatus =
            coils.data[0]
                ? "ON"
                : "OFF";

        const frequency =
            holdingRegisters.data[4];

        const pipeLength =
            currentPipeRegister.data[0];

        const alarm =
            holdingRegisters.data[10] === 1;

        /*
        -----------------------------------------
        PRODUCTION CALCULATION
        -----------------------------------------
        */

        console.log("\n========================================");
        console.log("NEW POLLING CYCLE");
        console.log("========================================");

        console.log("Received Pipe Length :", pipeLength);

        console.log("Previous Total       :", totalPipeLength);

        // Add every interval value
        totalPipeLength += pipeLength;

        console.log("Updated Total        :", totalPipeLength);

        console.log("========================================");

        /*
        -----------------------------------------
        DEBUG TABLE
        -----------------------------------------
        */

        console.clear();

        console.table({

            "Machine Status": machineStatus,

            "Frequency (Hz)": frequency,

            "Current Pipe Length (40120)": pipeLength,

            "Total Produced": totalPipeLength,

            "Alarm Register": holdingRegisters.data[10],

            "Alarm Status": alarm

        });

        /*
        -----------------------------------------
        Payload
        -----------------------------------------
        */

        const payload = {

            timestamp: Date.now(),

            registers: {

                motorStatus: machineStatus,

                frequency,

                pipeLength,

                totalPipeLength,

                alarm,

                alarmMessage:
                    alarm
                        ? "Machine 1 Motor Frequency Below 40 Hz"
                        : ""

            }

        };

        console.log("\n========================================");
        console.log("PAYLOAD");
        console.log("========================================");

        console.dir(payload, { depth: null });

        console.log("========================================\n");

        emitModbusData(payload);

    }

    catch (error) {

        console.log("\nPolling Error");

        console.log(error.message);

        reconnect();

    }

}

function startPolling() {

    if (pollingTimer) {

        clearInterval(pollingTimer);

    }

    pollingTimer = setInterval(() => {

        pollMachineData();

    }, CONFIG.pollingInterval);

}

function reconnect() {

    if (pollingTimer) {

        clearInterval(pollingTimer);

        pollingTimer = null;

    }

    try {

        client.close();

    }

    catch (err) {}

    console.log("\nReconnecting in 5 seconds...\n");

    setTimeout(() => {

        connectRealModbus();

    }, 5000);

}

function resetProductionReal() {

    console.log("\n====================================");
    console.log("SYSTEM RESET REQUEST RECEIVED");
    console.log("====================================");

    totalPipeLength = 0;
     // Immediately send latest values
    pollMachineData();

    console.log("✅ Total Production Reset Successfully");

}

module.exports = {

    connectRealModbus,

    resetProductionReal

};