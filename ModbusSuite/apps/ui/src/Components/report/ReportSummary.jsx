import {
    Grid,
    Paper,
    Typography,
    Chip
} from "@mui/material";

import dayjs from "dayjs";

import { useMachine } from "../../Context/MachineContext";
import { formatPipeLength, formatRuntime } from "../../helpers/helpers";

function ReportSummary() {

    const {
        machineData,
        history,
        runtime
    } = useMachine();

    const cards = [

        {
            title: "Today's Date",
            value: dayjs().format("DD MMM YYYY")
        },

       

        {
            title: "Total Records Saved",
            value: history.length
        },

        {
            title: "Machine Start Count",
            value: runtime.startCount || 0
        },

        {
            title: "Runtime Today",
            value: `${formatRuntime(runtime?.todayRuntime)|| 0}`
        },

        {
            title: "current motor frequency(HZ)",
            value: `${machineData.frequency} Hz`
        },

        {
            title: "TotalPipe Length produced",
            value: `${formatPipeLength(machineData.totalPipeLength )}`
        }

    ];

    return (

        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >

            {/* Motor Status */}

            <Grid item xs={12} sm={6} md={3}>

                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        textAlign: "center",
                        height: "100%",
                        transition: ".3s",
                        "&:hover": {
                            transform: "translateY(-3px)"
                        }
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Motor Status

                    </Typography>

                    <Chip

                        label={machineData.motorStatus}

                        color={
                            machineData.motorStatus === "ON"
                                ? "success"
                                : "error"
                        }

                        sx={{
                            mt: 2,
                            fontWeight: "bold"
                        }}

                    />

                </Paper>

            </Grid>

            {/* Frequency Alarm */}

            <Grid item xs={12} sm={6} md={3}>

                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        textAlign: "center",
                        height: "100%",
                        transition: ".3s",
                        "&:hover": {
                            transform: "translateY(-3px)"
                        }
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Alarm Status

                    </Typography>

                    <Chip

                        label={
                            machineData.alarm
                                ? "LOW FREQUENCY"
                                : "HEALTHY"
                        }

                        color={
                            machineData.alarm
                                ? "error"
                                : "success"
                        }

                        sx={{
                            mt: 2,
                            fontWeight: "bold"
                        }}

                    />

                </Paper>

            </Grid>

            {/* Remaining Cards */}

            {

                cards.map((card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={card.title}
                    >

                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                textAlign: "center",
                                height: "100%",
                                transition: ".3s",
                                "&:hover": {
                                    transform: "translateY(-3px)"
                                }
                            }}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                {card.title}

                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    mt: 1,
                                    fontWeight: 700
                                }}
                            >

                                {card.value}

                            </Typography>

                        </Paper>

                    </Grid>

                ))

            }

        </Grid>

    );

}

export default ReportSummary;