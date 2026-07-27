import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider
} from "@mui/material";

import ReportSummary from "./ReportSummary";
import ReportTable from "./ReportTable";
import reportService from "../../services/report.service";
import { useMachine } from "../../Context/MachineContext";

function MachineReportDialog({ open, onClose }) {

      const { history } = useMachine();
      console.log(history);
console.log(Array.isArray(history));

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
        >

            <DialogTitle>
                View & download operational history
            </DialogTitle>

            <Divider />

            <DialogContent>

                {/* Summary Section */}
                <ReportSummary />

                {/* Report Table */}
                <ReportTable />

            </DialogContent>

            <Divider />

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Close
                </Button>

              <Button
    variant="contained"
    color="success"
    onClick={() =>
        reportService.downloadExcel(history)
    }
>
    Download Excel
</Button>

            </DialogActions>

        </Dialog>

    );

}

export default MachineReportDialog;