import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    FormControlLabel,
    Checkbox,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio
} from "@mui/material";

import {
    LocalizationProvider
} from "@mui/x-date-pickers/LocalizationProvider";

import {
    AdapterDayjs
} from "@mui/x-date-pickers/AdapterDayjs";

import {
    DatePicker
} from "@mui/x-date-pickers/DatePicker";

import {
    TimePicker
} from "@mui/x-date-pickers/TimePicker";

import dayjs from "dayjs";
import { useState } from "react";

import resetSchedulerService from "../../services/resetScheduler.service";

function ScheduleResetDialog({

    open,

    onClose

}) {

    const [date, setDate] = useState(dayjs());

    const [time, setTime] = useState(dayjs());

    const [enabled, setEnabled] = useState(true);


    const [resetMode, setResetMode] = useState("once");
    



    const scheduleReset = () => {

        const resetAt = date
            .hour(time.hour())
            .minute(time.minute())
            .second(0);

        resetSchedulerService.save({

    enabled,

    mode: resetMode,

    resetAt: resetAt.format("YYYY-MM-DD HH:mm:ss")

});

      

        onClose();

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                Schedule System Reset

            </DialogTitle>

            <DialogContent>

                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                >

                    <Stack
                        spacing={3}
                        mt={2}
                    >

                        <DatePicker

                            label="Reset Date"

                            value={date}

                            onChange={setDate}

                        />

                      <TimePicker
    label="Reset Time"
    value={time}
    onChange={setTime}
    ampm={false}
    format="HH:mm"
    
/>

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={enabled}

                                    onChange={(e) =>
                                        setEnabled(
                                            e.target.checked
                                        )
                                    }

                                />

                            }

                            label="Enable Scheduled Reset"

                        />


<FormControl>

    <FormLabel>

        Reset Mode

    </FormLabel>

    <RadioGroup

        value={resetMode}

        onChange={(e) => setResetMode(e.target.value)}

    >

        <FormControlLabel

            value="once"

            control={<Radio />}

            label="One Time"

        />

        <FormControlLabel

            value="daily"

            control={<Radio />}

            label="Daily"

        />

    </RadioGroup>

</FormControl>
                       <Typography>

    Selected Time :

    {" "}

    {date
        .hour(time.hour())
        .minute(time.minute())
        .format("DD MMM YYYY HH:mm")}

</Typography>

                    </Stack>

                </LocalizationProvider>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    onClick={scheduleReset}

                >

                    Schedule

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ScheduleResetDialog;