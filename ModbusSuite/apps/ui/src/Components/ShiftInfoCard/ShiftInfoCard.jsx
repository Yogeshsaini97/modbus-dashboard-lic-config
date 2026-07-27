import { useContext, useEffect, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Avatar,
    Button
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import MachineContext from "../../Context/MachineContext";
import shiftService from "../../services/shift.service";
import shiftSettingsService from "../../services/shiftSettings.service";
import { formatPipeLength, formatRuntime, getShiftElapsedTime } from "../../helpers/helpers";
import ShiftSettingsDialog from "../ShiftSettingsDialog/ShiftSettingsDialog";

function ShiftInfoCard() {

   const {
    intervalData,
    currentInterval
} = useContext(MachineContext);

    const settings = shiftSettingsService.get();

   

    const [remainingTime, setRemainingTime] = useState("");

    const [progress, setProgress] = useState(0);
    const [openShiftSettings, setOpenShiftSettings] = useState(false);

    useEffect(() => {

        const update = () => {

           const interval =
    shiftService.getCurrentInterval();

const config = {

    start: interval.start,

    end: interval.end

};
            const now = new Date();

            const start = new Date();

            const end = new Date();

            const [sh, sm] =
                config.start.split(":").map(Number);

            const [eh, em] =
                config.end.split(":").map(Number);

            start.setHours(sh, sm, 0, 0);

            end.setHours(eh, em, 0, 0);

            if (eh < sh || (eh === sh && em <= sm)) {

                if (now.getHours() < eh) {

                    start.setDate(start.getDate() - 1);

                } else {

                    end.setDate(end.getDate() + 1);

                }

            }

            const total = end - start;

            const elapsed = now - start;

            let p = (elapsed / total) * 100;

            p = Math.min(100, Math.max(0, p));

            setProgress(p);

            let diff = end - now;

            if (diff < 0) diff = 0;

            const hrs = Math.floor(diff / 3600000);

            diff %= 3600000;

            const mins = Math.floor(diff / 60000);

            diff %= 60000;

            const secs = Math.floor(diff / 1000);

            setRemainingTime(

                `${hrs.toString().padStart(2, "0")}h ` +
                `${mins.toString().padStart(2, "0")}m ` +
                `${secs.toString().padStart(2, "0")}s`

            );

        };

        update();

        const timer = setInterval(update, 1000);

        return () => clearInterval(timer);

    }, []);

    

  const data =
    intervalData[
        currentInterval.key
    ] || {

        production: 0,

        runtime: 0,

        operator: "Operator Not Assigned"

    };

    const borderColor = "#1976d2";

   const gradient =
    "linear-gradient(135deg,#1565C0,#42A5F5)";

    const statusColor =
        progress > 98
            ? "warning"
            : "success";

   const Tile = ({ icon, title, value }) => (

    <Box
        sx={{
            flex: 1,
            minWidth: 160,
            p: 2,
            borderRadius: 3,
            background: "linear-gradient(135deg,#ffffff,#f5f7fa)",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            transition: "all .25s ease",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
            }
        }}
    >

        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
        >

            <Avatar
                sx={{
                    width: 46,
                    height: 46,
                    bgcolor: "#1976d2"
                }}
            >
                {icon}
            </Avatar>

            <Box sx={{ flex: 1 }}>

                <Typography
                    sx={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.8
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1f2937",
                        lineHeight: 1.2,
                        wordBreak: "break-word"
                    }}
                >
                    {value}
                </Typography>

            </Box>

        </Stack>

    </Box>

);

const interval = shiftService.getCurrentInterval();




return (

    <Card
        elevation={6}
        sx={{
            borderRadius: 4,
            overflow: "hidden",
            borderLeft: `6px solid ${borderColor}`,
            height: "100%"
        }}
    >

        {/* Header */}

        <Box
            sx={{
                background: gradient,
                color: "#fff",
                p: 2.5
            }}
        >

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight={700}

                    >
                        🏭 Shift Tracker
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ opacity: .9 }}
                    >
                        Live Shift Monitoring
                    </Typography>

                </Box>

                <Chip
                    label="RUNNING"
                    color={statusColor}
                    sx={{
                        fontWeight: 700,
                        bgcolor: "#fff",
                        color: "#2e7d32",
                        mx:3
                    }}
                />

            </Stack>

        </Box>

        <CardContent>

            {/* Shift */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >

                <Box>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                       Current Selected Shift Timings
                    </Typography>
<Button sx={{mx:"20px"}}
    variant="contained"
    onClick={() => setOpenShiftSettings(true)}
>
   Change shift timing
</Button>
                   <Typography
    variant="h5"
    fontWeight={700}
>
   {currentInterval.start} → {currentInterval.end}
</Typography>


                </Box>

                <Chip sx={{mx:"250px"}}
                    label={`${Math.round(progress)}% current shift Completed`}
                    color="primary"
                />

            </Stack>

            <Box mt={2}>

                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 10,
                        borderRadius: 10
                    }}
                />

            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Timing */}

            <Stack
                spacing={2}
            >

              

                <Box
                    display="flex"
                    justifyContent="space-between"
                >

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >

                        <UpdateIcon
                            color="success"
                            fontSize="small"
                        />

                        <Typography color="text.secondary">
                           Next Shift Starts In
                        </Typography>

                    </Stack>

                    <Typography
                        fontWeight={700}
                        color="success.main"
                    >
                        {remainingTime}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    justifyContent="space-between"
                >

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >

                        <ScheduleIcon
                            color="warning"
                            fontSize="small"
                        />

                        <Typography color="text.secondary">
                           System Will Automatically Reset And Save The Data At
                        </Typography>

                    </Stack>

                    <Typography
                        fontWeight={700}
                    >
                     {currentInterval.end}
                    </Typography>

                </Box>

            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* KPI Tiles */}

            <Stack
          
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
            >

                <Tile
                 
                    icon={<PrecisionManufacturingIcon fontSize="small" />}
                    title="Total Pipe Produced This Shift"
                    value={`${formatPipeLength(data.production)}`}
                />

                <Tile
    icon={<AccessTimeIcon fontSize="small" />}
    title="Shift Elapsed Time"
    value={getShiftElapsedTime(currentInterval)}
/>

                <Tile
                    icon={<EngineeringIcon fontSize="small" />}
                    title="Operator"
                    value={data.operator}
                />

                <Tile
                    icon={<AutorenewIcon fontSize="small" />}
                    title="Automatic Reset"
                    value={
                       "ON"
                    }
                />

            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Footer */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Production Status
                </Typography>

                <Chip 
                    color="success"
                    label="Production Active"
                    sx={{ fontWeight: 700 , mx:3}}
                />

            </Box>

        </CardContent>
<ShiftSettingsDialog
    open={openShiftSettings}
    onClose={() => setOpenShiftSettings(false)}
/>
    </Card>

);
}

export default ShiftInfoCard;