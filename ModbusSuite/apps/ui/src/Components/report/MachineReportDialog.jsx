import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    Stack
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";

import ReportSummary from "./ReportSummary";
import ReportTable from "./ReportTable";

import reportService from "../../services/report.service";


import { useMachine } from "../../Context/MachineContext";
import pdfReportService from "./pdfReport.service";

function MachineReportDialog({ open, onClose }) {

    const {
        history,
        machineData,
        runtime,
        events
    } = useMachine();

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
        >

            <DialogTitle>

                View operational history

            </DialogTitle>

            <Divider />

            <DialogContent>

                <ReportSummary />

                <ReportTable />

            </DialogContent>

            <Divider />

            <DialogActions
                sx={{
                    px:3,
                    py:2
                }}
            >

                <Button

                    variant="outlined"

                    onClick={onClose}

                >

                    Close

                </Button>

                {/* <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button

                        variant="contained"

                        color="success"

                        startIcon={<TableViewIcon />}

                        onClick={()=>

                            reportService.downloadExcel(history)

                        }

                    >

                        Download Excel

                    </Button>

                    

                </Stack> */}

            </DialogActions>

        </Dialog>

    );

}

export default MachineReportDialog;