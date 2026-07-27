import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import dayjs from "dayjs";

import { useMachine } from "../../Context/MachineContext";
import { formatPipeLength } from "../../helpers/helpers";

function ReportTable() {

    const { history } = useMachine();

    return (

        <TableContainer
            component={Paper}
            sx={{
                mt: 3,
                maxHeight: 500,
                borderRadius: 3
            }}
        >

            <Table stickyHeader>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Date & Time</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Motor Status Recorded</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Motor RPM Recorded</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Total Pipe Length produced(metre)</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {[...history].reverse().map((row) => (
                       
                        <TableRow
                            hover
                            key={row.timestamp}
                        >

                            <TableCell>

                                {dayjs(row.timestamp).format(
                                    "DD MMM YYYY hh:mm:ss A"
                                )}

                            </TableCell>

                            <TableCell align="center">

                                <Chip

                                    size="small"

                                    label={row.motorStatus}

                                    color={
                                        row.motorStatus === "ON"
                                            ? "success"
                                            : "error"
                                    }

                                />

                            </TableCell>

                            <TableCell align="center">

                                <strong>

                                    {row.frequency} RPM

                                </strong>

                            </TableCell>

                            <TableCell align="center">

                                <strong>

                                    {formatPipeLength(row.totalPipeLength || 0)}

                                </strong>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );

}

export default ReportTable;