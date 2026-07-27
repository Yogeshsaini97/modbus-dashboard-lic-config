import { useEffect, useState } from "react";

import MachineContext from "./MachineContext";

import StorageService from "../services/storage.service";
import HistoryService from "../services/history.service";
import RuntimeService from "../services/runtime.service";
import EventService from "../services/event.service";


import { APP_CONFIG } from "../config/app.config";

import socket from "../Socket/Socket";
import pdfReportService from "../Components/report/pdfReport.service";
import operatorService from "../services/operator.service";
import shiftService from "../services/shift.service";
import { toast } from "react-toastify";



function MachineProvider({ children }) {

    const [connected, setConnected] = useState(false);
const [intervalData, setIntervalData] = useState(
    shiftService.getIntervalData()
);

const [currentInterval, setCurrentInterval] = useState(
    shiftService.getCurrentInterval()
);

    const [machineData, setMachineData] = useState(

        StorageService.get(

            APP_CONFIG.STORAGE_KEYS.MACHINE_STATE,

            {

                motorStatus: "OFF",

                frequency: 0,

                pipeLength: 0,

                alarm: false,

                alarmMessage: "",

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

    motorStatus: payload.registers.motorStatus,

    frequency: payload.registers.frequency,

    pipeLength: payload.registers.pipeLength,

    totalPipeLength: payload.registers.totalPipeLength,

    alarm: payload.registers.alarm,

    alarmMessage: payload.registers.alarmMessage,

    timestamp: payload.timestamp

};

            const previousStatus = machineData.motorStatus;

            const previousAlarm = machineData.alarm;

            StorageService.save(

                APP_CONFIG.STORAGE_KEYS.MACHINE_STATE,

                newState

            );

            const updatedHistory =

                HistoryService.append(newState);

            const updatedRuntime =

                RuntimeService.update(

                    newState.motorStatus

                );
const intervalChanged =
    shiftService.checkIntervalChange();

if (intervalChanged) {

    console.log("Interval changed. Resetting system...");

    resetSystem(false);

}

                shiftService.updateProduction(newState.pipeLength);

shiftService.updateRuntime(updatedRuntime);

const updatedIntervalData =
    shiftService.getIntervalData();

    shiftService.setOperator(
    operatorService.get()
);

            let updatedEvents = events;

            // Motor Events

            if (previousStatus !== newState.motorStatus) {

                updatedEvents = EventService.add(

                    newState.motorStatus === "ON"

                        ? "Machine Started"

                        : "Machine Stopped"

                );

            }

            // Alarm Trigger

            if (!previousAlarm && newState.alarm) {

                updatedEvents = EventService.add(

                    "⚠ Low Frequency Alarm"

                );

            }

            // Alarm Cleared

            if (previousAlarm && !newState.alarm) {

                updatedEvents = EventService.add(

                    "✅ Frequency Back To Normal"

                );

            }

            setMachineData(newState);

            setHistory(updatedHistory);

            setRuntime(updatedRuntime);

           setIntervalData(updatedIntervalData);

setCurrentInterval(
    shiftService.getCurrentInterval()
);

            setEvents(updatedEvents);

        });

        return () => {

            socket.off("connect");

            socket.off("disconnect");

            socket.off("modbus-data");

        };

    }, [machineData, events]);


function resetSystem() {
toast.success("Shift reset completed successfully.");
    pdfReportService.download(
        machineData,
        history,
        runtime,
        currentInterval,
        intervalData[currentInterval.key]
    );

    socket.emit("reset-system");

    HistoryService.clearHistory();

    const resetRuntime = RuntimeService.reset();

    EventService.clear();

    shiftService.resetCurrentInterval();

    setIntervalData(
        shiftService.getIntervalData()
    );

    StorageService.remove(
        APP_CONFIG.STORAGE_KEYS.MACHINE_HISTORY
    );

    StorageService.remove(
        APP_CONFIG.STORAGE_KEYS.MACHINE_RUNTIME
    );

    StorageService.remove(
        APP_CONFIG.STORAGE_KEYS.MACHINE_EVENTS
    );

    setHistory([]);

    setRuntime(resetRuntime);

    setEvents([]);

    operatorService.save("Unassigned");

    setOperatorName("Unassigned");
    setOperatorInput("");

    setEditingOperator(true);

    setMachineData(prev => ({
        ...prev,
        totalPipeLength: 0
    }));

  
}
    return (

        <MachineContext.Provider

       value={{

    connected,

    machineData,

    runtime,

    history,

    events,

    intervalData,

    currentInterval,

    resetSystem

}}

        >

            {children}

        </MachineContext.Provider>

    );

}

export default MachineProvider;