import { useEffect, useState } from "react";
import socket from "../Socket/Socket";



function useMachineData() {

    const [machineData, setMachineData] = useState({

        power: "OFF",

        speed: 0,

        temperature: 0,

        torque: 0,

        voltage: 0,

        current: 0,

        vibration: 0,

        alarm: false,

        timestamp: null

    });

    const [connected, setConnected] = useState(false);

    useEffect(() => {

        socket.on("connect", () => {

            console.log("Connected");

            setConnected(true);

        });

        socket.on("disconnect", () => {

            console.log("Disconnected");

            setConnected(false);

        });

        socket.on("modbus-data", (payload) => {

            console.log(payload);

            setMachineData({

                power: payload.registers.speed > 0 ? "ON" : "OFF",

                speed: payload.registers.speed,

                temperature: payload.registers.temperature,

                torque: payload.registers.torque,

                voltage: payload.registers.voltage,

                current: payload.registers.current,

                vibration: payload.registers.vibration,

                alarm: payload.registers.alarm,

                timestamp: payload.timestamp

            });

        });

        return () => {

            socket.off("connect");

            socket.off("disconnect");

            socket.off("modbus-data");

        };

    }, []);

    return {

        machineData,

        connected

    };

}

export default useMachineData;