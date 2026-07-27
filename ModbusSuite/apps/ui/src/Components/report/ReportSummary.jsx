import { Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMachine } from "../../Context/MachineContext";


function ReportSummary() {

    const { machineData, history } = useMachine();

    const maxSpeed =
        history.length > 0
            ? Math.max(...history.map(item => item.speed))
            : 0;

    const avgSpeed =
        history.length > 0
            ? (
                  history.reduce(
                      (sum, item) => sum + item.speed,
                      0
                  ) / history.length
              ).toFixed(2)
            : 0;

    const maxTemperature =
        history.length > 0
            ? Math.max(...history.map(item => item.temperature))
            : 0;

    const cards = [
        {
            title: "Date",
            value: dayjs().format("DD MMM YYYY")
        },
        {
            title: "Records",
            value: history.length
        },
        {
            title: "Current Status",
            value: machineData.power
        },
        {
            title: "Current Speed",
            value: `${machineData.speed} RPM`
        },
        {
            title: "Average Speed",
            value: `${avgSpeed} RPM`
        },
        {
            title: "Maximum Speed",
            value: `${maxSpeed} RPM`
        },
        {
            title: "Current Temperature",
            value: `${machineData.temperature} °C`
        },
        {
            title: "Maximum Temperature",
            value: `${maxTemperature} °C`
        }
    ];

    return (

        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >

            {cards.map((card) => (

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
                            borderRadius: 2,
                            textAlign: "center"
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
                                fontWeight: "bold"
                            }}
                        >
                            {card.value}
                        </Typography>

                    </Paper>

                </Grid>

            ))}

        </Grid>

    );

}

export default ReportSummary;