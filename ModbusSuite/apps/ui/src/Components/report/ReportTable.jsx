import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

import dayjs from "dayjs";
import { useMachine } from "../../Context/MachineContext";



function ReportTable() {

    const { history } = useMachine();

    return (

        <TableContainer
            component={Paper}
            sx={{
                mt: 3,
                maxHeight: 500
            }}
        >

            <Table stickyHeader>

                <TableHead>

                    <TableRow>

                        <TableCell>Time</TableCell>

                        <TableCell>Power</TableCell>

                        <TableCell>Speed</TableCell>

                        <TableCell>Temperature</TableCell>

                        <TableCell>Current</TableCell>

                        <TableCell>Voltage</TableCell>

                        <TableCell>Torque</TableCell>

                        <TableCell>Alarm</TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {history.map((row) => (

                        <TableRow key={row.timestamp}>

                            <TableCell>

                                {dayjs(row.timestamp).format(
                                    "DD MMM YYYY hh:mm:ss A"
                                )}

                            </TableCell>

                            <TableCell>{row.power}</TableCell>

                            <TableCell>{row.speed} RPM</TableCell>

                            <TableCell>{row.temperature} °C</TableCell>

                            <TableCell>{row.current} A</TableCell>

                            <TableCell>{row.voltage} V</TableCell>

                            <TableCell>{row.torque}</TableCell>

                            <TableCell>

                                {row.alarm
                                    ? "Alarm"
                                    : "No Alarm"}

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default ReportTable;