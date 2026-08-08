

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import dayjs from "dayjs";

import RestartAltIcon from "@mui/icons-material/RestartAlt";

import VerifiedIcon from "@mui/icons-material/Verified";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import MemoryIcon from "@mui/icons-material/Memory";
import EngineeringIcon from "@mui/icons-material/Engineering";

import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import StraightenIcon from "@mui/icons-material/Straighten";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import {formatPipeLength, formatRuntime } from "../../helpers/helpers"
import StatusWidget from "../../Components/dashboard/widgets/StatusWidget";
import Header from "../../Components/Layout/Header/Header";
import { useMachine } from "../../Context/MachineContext";
import { AlarmDialog } from "./AlarmDialog";
import { useEffect, useState } from "react";
import ScheduleResetDialog from "../../Components/ScheduleResetDialog/ScheduleResetDialog";

import ScheduleIcon from "@mui/icons-material/Schedule";
import resetSchedulerService from "../../services/resetScheduler.service";
import operatorService from "../../services/operator.service";
import ShiftSettingsDialog from "../../Components/ShiftSettingsDialog/ShiftSettingsDialog";
import shiftService from "../../services/shift.service";
import ShiftInfoCard from "../../Components/ShiftInfoCard/ShiftInfoCard";
import { toast } from "react-toastify";

function Dashboard({ licenseInfo, daysLeft }) {

   const {

     machineData,
    history,
    runtime,
    currentInterval,
    intervalData,
    resetSystem,
    connected,
    events,
    storageReady

} = useMachine();

    const [alarmOpen, setAlarmOpen] = useState(false);
    const [alarmAcknowledged, setAlarmAcknowledged] = useState(false);
    const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
   const [timeLeft, setTimeLeft] = useState("No Reset Scheduled");
   const [resetExecuted, setResetExecuted] = useState(false);
const [isScheduleActive, setIsScheduleActive] = useState(false);
const [operatorName, setOperatorName] = useState(
    operatorService.get()
);

const [operatorInput, setOperatorInput] = useState("");
const [editingOperator, setEditingOperator] = useState(
    operatorName === "Unassigned"
);



const saveOperator = () => {

    const name = operatorInput.trim() || "Unassigned";

    operatorService.save(name);

    setOperatorName(name);

    setOperatorInput("");

    setEditingOperator(false);

};
   useEffect(() => {

    const updateCountdown = () => {

      

        const schedule = resetSchedulerService.get();

     

        if (!schedule || !schedule.enabled) {

           

            setTimeLeft("No Reset Scheduled");

            return;

        }

        const resetTime = dayjs(schedule.resetAt);

        const now = dayjs();

     

        const diff = resetTime.diff(now);

     

if (diff <= 0 && !resetExecuted) {

    setResetExecuted(true);

   

    if (schedule.mode === "once") {

        resetSchedulerService.clear();

        setTimeLeft("No Reset Scheduled");

    } else {

        const tomorrow = dayjs(schedule.resetAt)
            .add(1, "day")
            .format("YYYY-MM-DD HH:mm:ss");

        resetSchedulerService.save({

            enabled: true,

            mode: "daily",

            resetAt: tomorrow

        });

   

    }

    resetSystem(false);

    return;

}

if (diff > 60000 && resetExecuted) {

    setResetExecuted(false);

}
        const hours = Math.floor(diff / (1000 * 60 * 60));

        const minutes = Math.floor(
            (diff % (1000 * 60 * 60)) / (1000 * 60)
        );

        const seconds = Math.floor(
            (diff % (1000 * 60)) / 1000
        );

   
        const countdown =
            `${hours} Hr ${minutes} Min ${seconds} Sec`;

     

        setTimeLeft(countdown);

    

    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);

}, [storageReady]);
useEffect(() => {

    const syncOperator = () => {

        const operator = operatorService.get();

        setOperatorName(operator);

        if (operator === "Unassigned") {

            setOperatorInput("");

            setEditingOperator(true);

        }

    };

    syncOperator();

    window.addEventListener("focus", syncOperator);

    return () => {

        window.removeEventListener("focus", syncOperator);

    };

}, [storageReady]);

useEffect(() => {

    const checkSchedule = () => {

        const schedule = resetSchedulerService.get();

        setIsScheduleActive(

            schedule?.enabled === true

        );

    };

    checkSchedule();

    const timer = setInterval(checkSchedule, 1000);

    return () => clearInterval(timer);

}, [storageReady]);
useEffect(() => {

    if (!machineData.alarm) {

        setAlarmAcknowledged(false);

    }

}, [machineData.alarm]);



    return (

        <Box
            sx={{
                background: "#0B1120",
                minHeight: "100vh"
            }}
        >

            <Header
                connected={connected}
                licenseInfo={licenseInfo}
                daysLeft={daysLeft}
            />

            <Box sx={{
        p: 4,
        maxWidth: 1700,
        mx: "auto"
    }}>

                {/* Machine Status */}

                <Paper
                    elevation={5}
                    sx={{
                        p: 2,
                        mb: 3,
                        background: "#1E293B",
                        border: "1px solid #334155",
                        display:"flex",
                        justifyContent:"space-between"
                        
                    }}
                >

                    <Grid container
    spacing={4}
    justifyContent="center"
    alignItems="stretch">

                        <Grid  item xs={12} md={3}>

                            <Typography color="gray">
                                Machine
                            </Typography>

                            <Typography variant="h6">
                               Braiding Machine no. 17
                            </Typography>
        

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <Typography color="gray">
                                Communication
                            </Typography>

                            <Chip
                                color={
                                    connected
                                        ? "success"
                                        : "error"
                                }
                                label={
                                    connected
                                        ? "CONNECTED"
                                        : "OFFLINE"
                                }
                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <Typography color="gray">
                                Runtime Today
                            </Typography>

                            <Typography variant="h6">

                                {formatRuntime(runtime?.todayRuntime) || 0}

                            </Typography>

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <Typography color="gray">
                                Motor Restarted Count
                            </Typography>

                            <Typography variant="h6">

                                {runtime?.startCount || 0}

                            </Typography>

                        </Grid>

                    </Grid>

                    <div>
                        <Box
display="flex"
justifyContent="space-between"
alignItems="center"
sx={{display:"flex",justifyContent:"flex-end",marginTop:"5px",marginBottom:"10px"}}
>

<Stack
direction="row"
spacing={1}
alignItems="center"
>

<EngineeringIcon
sx={{color:"#2563EB"}}
/>

<Typography
fontSize={13}
color="gray"
>

Powered by

<b style={{color:"#fff"}}> Saini Enterprises</b>

</Typography>


</Stack>

<MemoryIcon
sx={{
color:"#22C55E"
}}
/>

</Box>


                    </div>

                </Paper>
                

                {/* KPI Section */}

                <Grid container
  spacing={4}
  sx={{
    display: "flex",
    alignContent: "flex-start",
    justifyContent: "space-between",
  }}>

                    <Grid  sx={{width:"250px"}} item xs={12} sm={6} md={6} lg={3} xl={3}>

                        <StatusWidget
                       
                            title="MOTOR STATUS"
value={machineData.motorStatus}
subtitle="Machine Running"
color={
    machineData.motorStatus === "ON"
        ? "#22C55E"
        : "#EF4444"
}
                            icon={
                                <BoltIcon
                                    sx={{ fontSize: 42 }}
                                />
                            }
                        />

                    </Grid>

                    <Grid  sx={{width:"250px"}} item xs={12} sm={6} md={6} lg={3} xl={3}>

                        <StatusWidget
                           title="MOTOR FREQUENCY"

value={machineData.frequency}

unit="Hz"

subtitle={
    machineData.alarm
        ? "Low Frequency"
        : "Realtime"
}

color={
    machineData.alarm
        ? "#EF4444"
        : "#2563EB"
}
                            icon={
                                <SpeedIcon
                                    sx={{ fontSize: 42 }}
                                />
                            }
                        />

                    </Grid>
{/* 
                    <Grid  sx={{width:"250px"}} item xs={12} sm={6} md={6} lg={3} xl={3}>

                        <StatusWidget
                           title="Live PIPE LENGTH"

value={formatPipeLength(machineData.pipeLength)}

unit=""

subtitle="Current Pipe produced per minute"
                            color="#F59E0B"
                            icon={
                                <StraightenIcon
                                    sx={{ fontSize: 42 }}
                                />
                            }
                        />

                    </Grid> */}

                    <Grid sx={{ width: "250px" }} item xs={12} sm={6} md={6} lg={3} xl={3}>

    <StatusWidget

        title="TOTAL PRODUCED PIPE"

        value={formatPipeLength(machineData.totalPipeLength || 0)}

        unit=""

        subtitle="Total Pipe length produced(Current Shift)"

        color="#22C55E"

        icon={
            <PrecisionManufacturingIcon
                sx={{ fontSize: 42 }}
            />
        }

    />

</Grid>

                    <Grid  sx={{width:"250px"}} item xs={12} sm={6} md={6} lg={3} xl={3}>

                        <StatusWidget
                            title="TODAY'S RUNTIME"

value={formatRuntime(runtime.todayRuntime) || 0}

unit=""

subtitle="Today's Production"

color="#A855F7"

icon={<AccessTimeFilledIcon sx={{fontSize:42}} />}
                        />

                    </Grid>

                </Grid>

                {/* Bottom Section */}

                <Grid
                    container
                   
                    
                    
  spacing={4}
  sx={{
     mt: 4,
    alignItems: "stretch"
  }}
                >


                   

  


                   <Grid item xs={12} md={6} lg={4}>
    <ShiftInfoCard />
</Grid>
 <Grid item xs={12} lg={8} sx={{width: "400px"}}>

                       <Box
    sx={{
        mt: 3,
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#ffffff",
        border: "1px solid #E5E7EB",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 3,
        flexWrap: "wrap",
        marginTop:"0px",
        justifyContent:"center"
        
    }}
>
<Paper

    elevation={0}
    sx={{
        p: 3,
        mt: 3,
        borderRadius: 3,
        bgcolor: "#1E293B",
        border: "1px solid rgba(255,255,255,.08)",
        marginTop:"0px"
    }}
>

    <Typography
        variant="h6"
        sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 2
        }}
    >
        Current Shift Operator
    </Typography>

 {editingOperator ? (

    <>
        <TextField

            fullWidth

            placeholder="Enter current shift operator name"

            value={operatorInput}

            onChange={(e) => setOperatorInput(e.target.value)}

            sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                 
                }
            }}

        />

        <Button

            variant="contained"

            onClick={saveOperator}

        >

            Save Operator Name

        </Button>

    </>

) : (

    <Paper

        elevation={0}

        sx={{
            p: 2,
           
            borderRadius: 2,
            border: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}

    >

        <Typography
            fontWeight={600}
        >

            👤 {operatorName}

        </Typography>

        <Button

            size="small"

            variant="outlined"

            onClick={() => {

                setOperatorInput(operatorName);

                setEditingOperator(true);

            }}

        >

            Edit

        </Button>

    </Paper>

)}



    <Typography
        sx={{
            mt: 2,
            color: "#fff",
            fontWeight: 600
        }}
    >

        👤 Current Operator :{" "}

        <span style={{ color: "#4ADE80" }}>

            {operatorName}

        </span>

    </Typography>

</Paper>
    {/* Left Buttons */}

    <Stack
        direction="row"
        spacing={2}
    >

        <Button

            variant="contained"

            color="warning"

            size="large"

            startIcon={<RestartAltIcon />}

            onClick={() => {

               if (
    window.confirm(
        "⚠ Warning!\n\n" +
        "Before resetting the system, please download and save the PDF report if you wish to keep your production data.\n\n" +
        "This action will permanently clear the current production history, runtime, events, and production counters.\n\n" +
        "This action cannot be undone.\n\n" +
        "Are you sure you want to continue?"
    )
) {
    resetSystem(false);
}

            }}

            sx={{

                px: 3,

                py: 1.3,

                fontWeight: 700,

                borderRadius: 3,

                textTransform: "none",

                boxShadow: "0 6px 18px rgba(245,158,11,.35)",

                "&:hover": {

                    transform: "translateY(-2px)",

                    boxShadow: "0 10px 24px rgba(245,158,11,.45)"

                }

            }}

        >

            Reset System now

        </Button>

    
    </Stack>

  
</Box>

                    </Grid>

 

                </Grid>
                
                <Card>



</Card>
                  <Grid  item xs={12} sx={{my:3}} lg={4}>

<Paper
    elevation={0}
    sx={{
        height: "100%",
        p: 3,
        borderRadius: 4,
        background: "#1E293B",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 15px 35px rgba(0,0,0,.25)"
    }}
>

<Box
display="flex"
alignItems="center"
justifyContent="space-between"
mb={2}
>

<Stack direction="row" spacing={2} alignItems="center">

<Avatar
sx={{
bgcolor:"#2563EB",
width:52,
height:52
}}
>

<PrecisionManufacturingIcon/>

</Avatar>

<Box > 

<Typography
variant="h6"
fontWeight="bold"
>

AC Drive

</Typography>

<Typography
variant="body2"
color="gray"
>

Industrial Servo System

</Typography>

</Box>

</Stack>

<Chip
    icon={<VerifiedIcon />}
    label={
        machineData.alarm
            ? "Low Frequency Alarm"
            : "Healthy"
    }
    color={
        machineData.alarm
            ? "error"
            : "success"
    }
/>

</Box>

<Divider sx={{mb:2}}/>


<Grid container spacing={2}>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Motor Company
</Typography>

<Typography fontWeight="bold">
N/A
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Model
</Typography>

<Typography fontWeight="bold">
N/A
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Motor Power
</Typography>

<Typography fontWeight="bold">
1.5 kW
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Rated Speed
</Typography>

<Typography fontWeight="bold">
930 RPM
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Voltage
</Typography>

<Typography fontWeight="bold">
415 VAC
</Typography>

</Grid>



<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Service Due
</Typography>

<Chip
size="small"
label="12 Jul 2026"
color="warning"
/>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Software
</Typography>

<Typography fontWeight="bold">
v1.0.0
</Typography>

</Grid>

</Grid>

<Divider sx={{my:3}}/>

<Typography
variant="subtitle1"
fontWeight="bold"
mb={2}
>

Live Machine Data

</Typography>

<Stack spacing={1.5}>

<Box
display="flex"
justifyContent="space-between"
>

<Typography color="gray">

Machine Status

</Typography>

<Chip

size="small"

label={machineData.motorStatus}

color={
machineData.motorStatus==="ON"
?"success"
:"error"
}

/>

</Box>

<Box
display="flex"
justifyContent="space-between"
>

<Typography color="gray">

Motor Frequency

</Typography>

<Typography fontWeight="bold">

{machineData.frequency} Hz

</Typography>

</Box>

<Box
display="flex"
justifyContent="space-between"
>

<Typography color="gray">

Pipe Length

</Typography>

<Typography fontWeight="bold">

{formatPipeLength(machineData.pipeLength)}

</Typography>

</Box>

<Box
display="flex"
justifyContent="space-between"
>

<Typography color="gray">

Alarm Status

</Typography>

<Chip

size="small"

label={
machineData.alarm
?"ACTIVE"
:"HEALTHY"
}

color={
machineData.alarm
?"error"
:"success"
}

/>

</Box>

<Box
display="flex"
justifyContent="space-between"
>

<Typography color="gray">

Events Today

</Typography>

<Typography fontWeight="bold">

{events.length}

</Typography>

</Box>

</Stack>

<Divider sx={{my:3}}/>

<Box
display="flex"
justifyContent="space-between"
alignItems="center"
>

<Stack
direction="row"
spacing={1}
alignItems="center"
>

<EngineeringIcon
sx={{color:"#2563EB"}}
/>

<Typography
fontSize={13}
color="gray"
>

Powered by

<b style={{color:"#fff"}}> Saini Enterprises</b>

</Typography>

</Stack>

<MemoryIcon
sx={{
color:"#22C55E"
}}
/>

</Box>

</Paper>

</Grid>
            </Box>
<AlarmDialog
    open={machineData.alarm && !alarmAcknowledged}
    frequency={machineData.frequency}
    alarmMessage={machineData.alarmMessage}
    onAcknowledge={() => setAlarmAcknowledged(true)}
/>

<ScheduleResetDialog

    open={openScheduleDialog}

    onClose={() => setOpenScheduleDialog(false)}

/>

        </Box>

    );

}

export default Dashboard;
