let io = null;

function initializeSocket(socketInstance) {

  io = socketInstance;

}

function emitModbusData(data) {

  if (io) {

    io.emit("modbus-data", data);

  }

}

module.exports = {
  initializeSocket,
  emitModbusData
};