import {

    AppBar,

    Toolbar,

    Typography,

    Box,

    Chip,
    Button

} from "@mui/material";

import dayjs from "dayjs";
import { useMachine } from "../../../Context/MachineContext";
import { useState } from "react";
import MachineReportDialog from "../../report/MachineReportDialog";
import pdfReportService from "../../report/pdfReport.service";
import vanshLogo from "../../../assets/vansh_logo.jpeg";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";



function Header({ licenseInfo, daysLeft }) {

    const { connected } = useMachine();
     const [openReport, setOpenReport] = useState(false);

      const {
         machineData,
    history,
    runtime,
    currentInterval,
    intervalData
    } = useMachine();

    return (

        <AppBar

            position="static"

            elevation={0}

            sx={{

                background: "#111827",

                borderBottom: "1px solid #334155"

            }}

        >

            <Toolbar sx={{ gap: 1.5, flexWrap: "wrap", py: 1 }}>
<Box
    sx={{
        display: "flex",
        alignItems: "center",
        gap: 2
    }}
>
    <Box
        component="img"
        src={vanshLogo}
        alt="Vansh Industries"
        sx={{
            width: 68,
            height: 60,
            borderRadius: "10px",
            objectFit: "contain"
        }}
    />

    <Box>
        <Typography variant="h6" fontWeight={700}>
            Vansh Industries
        </Typography>

        <Typography variant="caption" color="text.secondary">
            Industrial Monitoring Platform
        </Typography>
    </Box>
</Box>
            

                <Box sx={{ flexGrow: 1 , marginInline:"12px"}} />
    {licenseInfo && (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 220,
                px: 1.25,
                py: 0.75,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: daysLeft <= 7 ? "warning.main" : "success.main",
                backgroundColor: "rgba(15, 23, 42, 0.55)",
            }}
        >
            <WorkspacePremiumIcon color={daysLeft <= 7 ? "warning" : "success"} />
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ display: "block", color: "grey.300", lineHeight: 1.2 }}>
                    {licenseInfo.licenseType} License{licenseInfo.customer ? ` · ${licenseInfo.customer}` : ""}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                    {daysLeft} day{daysLeft === 1 ? "" : "s"} remaining
                    {licenseInfo.expiresOn ? ` · Expires ${dayjs(licenseInfo.expiresOn).format("DD MMM YYYY")}` : ""}
                </Typography>
            </Box>
        </Box>
    )}
    <Button
    variant="contained"
    onClick={() => setOpenReport(true)}
    sx={{  marginInline:"12px"}}
>
    View operational history
</Button>
<Button
 sx={{  marginInline:"12px"}}
    variant="contained"

    color="error"

    onClick={() =>

        pdfReportService.download(
    machineData,
    history,
    runtime,
    currentInterval,
    intervalData[currentInterval.key]
)

    }

>

    Download PDF Report

</Button>


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

                <Typography

                    sx={{

                        ml: 3

                    }}

                >

                    {dayjs().format("DD MMM YYYY")}

                </Typography>

            </Toolbar>
<MachineReportDialog
    open={openReport}
    onClose={() => setOpenReport(false)}
/>
        </AppBar>

    );

}

export default Header;
