module.exports = {
 
  // RS485 CONFIG
  comPort: "COM2",

  baudRate: 9600,

  dataBits: 8,

  parity: "none",

  stopBits: 1,

  slaveID: 1,

  pollingInterval: 60000,

  // REGISTERS
  holdingRegisters: {
    startAddress: 0,
    count: 10
  }

};