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



function Header() {

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

            <Toolbar>
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