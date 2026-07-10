const { emitModbusData } = require("./socket");

let speed = 1000;

let temperature = 30;

let torque = 20;

function generateDummyData() {

  speed += Math.floor(Math.random() * 100 - 50);

  temperature += Math.random() * 2 - 1;

  torque += Math.random() * 4 - 2;

  if (speed < 500) speed = 500;

  if (speed > 3000) speed = 3000;

  if (temperature < 20) temperature = 20;

  if (temperature > 90) temperature = 90;

  if (torque < 0) torque = 0;

  if (torque > 100) torque = 100;

  return {

    timestamp: Date.now(),

    registers: {

      speed,

      temperature: Number(temperature.toFixed(2)),

      torque: Number(torque.toFixed(2)),

      voltage: 220 + Math.floor(Math.random() * 10),

      current: Number((5 + Math.random() * 2).toFixed(2)),

      vibration: Math.floor(Math.random() * 20),

      alarm: Math.random() > 0.95

    }

  };

}

function startDummyPolling() {

  console.log("Dummy Modbus Started");

  setInterval(() => {

    const payload = generateDummyData();

    console.log(payload);

    emitModbusData(payload);

  }, 1000);

}

module.exports = {
  startDummyPolling
};