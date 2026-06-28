import { useEffect, useState } from "react";

import MachineContext from "./MachineContext";



import StorageService from "../services/storage.service";

import HistoryService from "../services/history.service";

import RuntimeService from "../services/runtime.service";

import EventService from "../services/event.service";

import { APP_CONFIG } from "../config/app.config";
import socket from "../Socket/Socket";

function MachineProvider({ children }) {

    const [connected, setConnected] = useState(false);

    const [machineData, setMachineData] = useState(

        StorageService.get(

            APP_CONFIG.STORAGE_KEYS.MACHINE_STATE,

            {

                power: "OFF",

                speed: 0,

                temperature: 0,

                current: 0,

                voltage: 0,

                torque: 0,

                vibration: 0,

                alarm: false,

                timestamp: null

            }

        )

    );

    const [runtime, setRuntime] = useState(

        RuntimeService.getRuntime()

    );

    const [history, setHistory] = useState(

        HistoryService.getHistory()

    );

    const [events, setEvents] = useState(

        EventService.getEvents()

    );

    useEffect(() => {

        socket.on("connect", () => {

            setConnected(true);

        });

        socket.on("disconnect", () => {

            setConnected(false);

        });

        socket.on("modbus-data", (payload) => {

            const newState = {

                power:

                    payload.registers.speed > 0

                        ? "ON"

                        : "OFF",

                speed: payload.registers.speed,

                temperature: payload.registers.temperature,

                current: payload.registers.current,

                voltage: payload.registers.voltage,

                torque: payload.registers.torque,

                vibration: payload.registers.vibration,

                alarm: payload.registers.alarm,

                timestamp: payload.timestamp

            };

            // Previous state

            const previousPower = machineData.power;

            // Save latest state

            StorageService.save(

                APP_CONFIG.STORAGE_KEYS.MACHINE_STATE,

                newState

            );

            // Save history

            const updatedHistory =

                HistoryService.append(newState);

            // Runtime

            const updatedRuntime =

                RuntimeService.update(

                    newState.power

                );

            // Events

            let updatedEvents = events;

            if (

                previousPower !== newState.power

            ) {

                updatedEvents = EventService.add(

                    newState.power === "ON"

                        ? "Motor Started"

                        : "Motor Stopped"

                );

            }

            setMachineData(newState);

            setHistory(updatedHistory);

            setRuntime(updatedRuntime);

            setEvents(updatedEvents);

        });

        return () => {

            socket.off("connect");

            socket.off("disconnect");

            socket.off("modbus-data");

        };

    }, [machineData, events]);

    return (

        <MachineContext.Provider

            value={{

                connected,

                machineData,

                runtime,

                history,

                events

            }}

        >

            {children}

        </MachineContext.Provider>

    );

}

export default MachineProvider;