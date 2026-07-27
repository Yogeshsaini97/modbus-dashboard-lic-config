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



function Header() {

    const { connected } = useMachine();
     const [openReport, setOpenReport] = useState(false);

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

                <Box>

                    <Typography variant="h6">

                        Vansh Industries

                    </Typography>

                    <Typography

                        variant="caption"

                    >

                        Industrial Monitoring Platform

                    </Typography>

                </Box>
            

                <Box sx={{ flexGrow: 1 , marginInline:"12px"}} />
    <Button
    variant="contained"
    onClick={() => setOpenReport(true)}
    sx={{  marginInline:"12px"}}
>
    View & download operational history
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