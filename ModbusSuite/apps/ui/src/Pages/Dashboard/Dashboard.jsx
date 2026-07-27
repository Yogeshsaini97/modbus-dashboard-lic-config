

import {
    Avatar,
    Box,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";


import VerifiedIcon from "@mui/icons-material/Verified";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import MemoryIcon from "@mui/icons-material/Memory";
import EngineeringIcon from "@mui/icons-material/Engineering";

import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

import StatusWidget from "../../Components/dashboard/widgets/StatusWidget";
import Header from "../../Components/Layout/Header/Header";
import { useMachine } from "../../Context/MachineContext";

function Dashboard() {

    const {
        machineData,
        connected,
        runtime,
        events
    } = useMachine();

    return (

        <Box
            sx={{
                background: "#0B1120",
                minHeight: "100vh"
            }}
        >

            <Header connected={connected} />

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
                                Servo Machine 01
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

                                {runtime?.todayRuntime || 0} sec

                            </Typography>

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <Typography color="gray">
                                Starts Today
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
                       
                            title="POWER STATUS"
                            value={machineData.power}
                            subtitle="Machine Healthy"
                            color={
                                machineData.power === "ON"
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
                            title="MOTOR SPEED"
                            value={`${machineData.speed}`}
                            unit="RPM"
                            subtitle="Realtime"
                            color="#2563EB"
                            icon={
                                <SpeedIcon
                                    sx={{ fontSize: 42 }}
                                />
                            }
                        />

                    </Grid>

                    <Grid  sx={{width:"250px"}} item xs={12} sm={6} md={6} lg={3} xl={3}>

                        <StatusWidget
                            title="TEMPERATURE"
                            value={`${machineData.temperature}`}
                            unit="°C"
                            subtitle="Normal"
                            color="#F59E0B"
                            icon={
                                <DeviceThermostatIcon
                                    sx={{ fontSize: 42 }}
                                />
                            }
                        />

                    </Grid>

                    <Grid  sx={{width:"250px"}} item xs={12} sm={6} md={6} lg={3} xl={3}>

                        <StatusWidget
                            title="CURRENT"
                            value={`${machineData.current}`}
                            unit="A"
                            subtitle="Running"
                            color="#EF4444"
                            icon={
                                <ElectricBoltIcon
                                    sx={{ fontSize: 42 }}
                                />
                            }
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

                   

                    <Grid  item xs={12} lg={4}>

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

<Box>

<Typography
variant="h6"
fontWeight="bold"
>

Servo Machine 01

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

icon={<VerifiedIcon/>}

label="Healthy"

color="success"

/>

</Box>

<Divider sx={{mb:2}}/>

<Grid container spacing={2}>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Motor Company
</Typography>

<Typography fontWeight="bold">
Siemens
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Model
</Typography>

<Typography fontWeight="bold">
SIMOTICS GP
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Motor Power
</Typography>

<Typography fontWeight="bold">
5.5 kW
</Typography>

</Grid>

<Grid item xs={6}>

<Typography color="gray" fontSize={13}>
Rated Speed
</Typography>

<Typography fontWeight="bold">
1500 RPM
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
Serial No.
</Typography>

<Typography fontWeight="bold">
SM-2026-00145
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

<Box display="flex" justifyContent="space-between">

<Typography color="gray">
Current Speed
</Typography>

<Typography fontWeight="bold">

{machineData.speed} RPM

</Typography>

</Box>

<Box display="flex" justifyContent="space-between">

<Typography color="gray">
Temperature
</Typography>

<Typography fontWeight="bold">

{machineData.temperature} °C

</Typography>

</Box>

<Box display="flex" justifyContent="space-between">

<Typography color="gray">
Current
</Typography>

<Typography fontWeight="bold">

{machineData.current} A

</Typography>

</Box>

<Box display="flex" justifyContent="space-between">

<Typography color="gray">
Power Status
</Typography>

<Chip
size="small"
label={machineData.power}
color={
machineData.power==="ON"
?"success"
:"error"
}
/>

</Box>

<Box display="flex" justifyContent="space-between">

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
 <Grid item xs={12} lg={8} sx={{width: "400px"}}>

                        <Paper
                            sx={{
                              
                                height: 320,
                               p: 3,
    background: "#1E293B",
    borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
                            }}
                        >

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                <SpeedIcon />

                                &nbsp; Live Speed Trend
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                           <Box
    sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "gray"
    }}
>
    Live Speed Chart
    <br />
    Coming Soon
</Box>

                        </Paper>

                    </Grid>

                </Grid>

            </Box>

        </Box>

    );

}

export default Dashboard;