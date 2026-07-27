const { emitModbusData } = require("./socket");

// Machine Status
let motorStatus = "ON";

// Frequency (Hz)
let frequency = 52;

// Pipe Length (mm)
let pipeLength = 0;

// Total Production
let totalPipeLength = 0;




// Alarm
let alarm = false;

// Direction for smooth frequency movement
let direction = -0.3;


function generateDummyData() {

    // Random machine OFF
    if (motorStatus === "ON" && Math.random() > 0.995) {

        motorStatus = "OFF";
        frequency = 0;

    }

    // Random machine ON
    if (motorStatus === "OFF" && Math.random() > 0.98) {

        motorStatus = "ON";
        frequency = 52;
        direction = -0.3;

    }

    if (motorStatus === "ON") {

        /*
        -----------------------------------------
        Smooth Frequency Movement
        -----------------------------------------
        */

        frequency += direction;

        if (frequency <= 47) {

            direction = 0.4;

        }

        if (frequency >= 54) {

            direction = -0.4;

        }

        frequency = Number(frequency.toFixed(1));

        /*
        -----------------------------------------
        Pipe Production (Same as Real PLC)
        -----------------------------------------
        */

        // Production generated in this polling interval
        pipeLength = Math.floor(Math.random() * 70) + 50;

        // Total production
        totalPipeLength += pipeLength;

    } else {

        // Machine OFF
        pipeLength = 0;

    }

    /*
    -----------------------------------------
    Alarm
    -----------------------------------------
    */

    alarm =
        motorStatus === "ON" &&
        frequency < 40;

    return {

        timestamp: Date.now(),

        registers: {

            motorStatus,

            frequency,

            pipeLength,

            totalPipeLength,

            alarm,

            alarmMessage: alarm
                ? "Machine 1 Motor Frequency Below 40 Hz"
                : ""

        }

    };

}

function startDummyPolling() {

    console.log("Dummy Modbus Started...");

    setInterval(() => {

        const payload = generateDummyData();

        console.clear();

       console.table({

    "Machine Status": payload.registers.motorStatus,

    "Frequency (Hz)": payload.registers.frequency,

    "Current Pipe (mm)": payload.registers.pipeLength,

    "Total Produced (mm)": payload.registers.totalPipeLength,

    "Alarm": payload.registers.alarm

});

        emitModbusData(payload);

    }, 1000);

}


function resetProductionDummy() {

    console.log("\n====================================");
    console.log("SYSTEM RESET REQUEST RECEIVED");
    console.log("====================================");

    pipeLength = 0;
    totalPipeLength = 0;

    const payload = generateDummyData();

    emitModbusData(payload);

    console.log("✅ Total Production Reset Successfully");

}

module.exports = {

    startDummyPolling,
    resetProductionDummy

};