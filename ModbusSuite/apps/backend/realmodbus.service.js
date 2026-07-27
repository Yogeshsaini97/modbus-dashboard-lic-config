const ModbusRTU = require("modbus-serial");

const { emitModbusData } = require("./socket");

const client = new ModbusRTU();

async function connectRealModbus() {

  try {

    console.log("Connecting Real Modbus...");

    await client.connectRTUBuffered("COM2", {

      baudRate: 9600,

      dataBits: 8,

      parity: "none",

      stopBits: 1

    });

    client.setID(1);

    console.log("Real Modbus Connected");

    startRealPolling();

  } catch (error) {

    console.log("Modbus Connection Failed");

    console.log(error.message);

    reconnect();

  }

}

async function pollRealData() {

  try {

    // READ HOLDING REGISTERS

    const response = await client.readHoldingRegisters(0, 10);

    const registers = response.data;

    // CONVERT RAW REGISTERS TO MEANINGFUL DATA

    const payload = {

      timestamp: Date.now(),

      registers: {

        speed: registers[0],

        temperature: registers[1] / 10,

        torque: registers[2],

        voltage: registers[3],

        current: registers[4] / 100,

        vibration: registers[5],

        alarm: registers[6] === 1

      }

    };

    console.log(payload);

    emitModbusData(payload);

  } catch (error) {

    console.log("Polling Error");

    console.log(error.message);

    reconnect();

  }

}

function startRealPolling() {

  setInterval(async () => {

    await pollRealData();

  }, 1000);

}

function reconnect() {

  setTimeout(async () => {

    console.log("Reconnecting Modbus...");

    await connectRealModbus();

  }, 5000);

}

module.exports = {
  connectRealModbus
};