import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    FormControlLabel,
    Switch,
    Snackbar,
    Alert
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import dayjs from "dayjs";

import shiftSettingsService from "../../services/shiftSettings.service";
import shiftService from "../../services/shift.service";

const DEFAULT_SETTINGS = {
    resetTimes: [
        "07:00",
        "19:00"
    ],
    autoReset: true
};

function ShiftSettingsDialog({
    open,
    onClose
}) {

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const [saved, setSaved] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (open) {

            const stored = shiftSettingsService.get();

            setSettings(stored || DEFAULT_SETTINGS);

            setError("");

        }

    }, [open]);

    const updateResetTime = (index, value) => {

        if (!value) return;

        const times = [...settings.resetTimes];

        times[index] = value.format("HH:mm");

        setSettings({
            ...settings,
            resetTimes: times
        });

        setError("");

    };

    const saveSettings = () => {

        if (
            settings.resetTimes[0] ===
            settings.resetTimes[1]
        ) {

            setError(
                "Reset times cannot be the same."
            );

            return;

        }

       shiftSettingsService.save(settings);

shiftService.syncCurrentInterval();

        setSaved(true);

        onClose();

    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                
            >

                <DialogTitle>
                    Change Shift Timings
                </DialogTitle>

                <DialogContent>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Configure the two Shift reset times.
                        Total Production, runtime and operator information will
                        automatically reset whenever either configured
                        reset time is reached.
                    </Typography>

                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <TimePicker
                                  slotProps={{
        desktopPaper: {
            elevation: 8
        },
        textField: {
            fullWidth: true
        }
    }}
                                    label="Reset Time 1"
                                    value={dayjs(
                                        settings.resetTimes[0],
                                        "HH:mm"
                                    )}
                                    onChange={(value) =>
                                        updateResetTime(
                                            0,
                                            value
                                        )
                                    }
                                    ampm={false}
                                    format="HH:mm"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true
                                        }
                                    }}
                                />

                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>

                                <TimePicker
                                
                                    label="Reset Time 2"
                                    value={dayjs(
                                        settings.resetTimes[1],
                                        "HH:mm"
                                    )}
                                    onChange={(value) =>
                                        updateResetTime(
                                            1,
                                            value
                                        )
                                    }
                                    ampm={false}
                                    format="HH:mm"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true
                                        }
                                    }}
                                />

                            </Grid>

                        </Grid>

                    </LocalizationProvider>

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {error}
                        </Alert>

                    )}

                    <Divider sx={{ my: 3 }} />

                  

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={saveSettings}
                    >
                        Save
                    </Button>

                </DialogActions>

            </Dialog>

            <Snackbar
                open={saved}
                autoHideDuration={3000}
                onClose={() =>
                    setSaved(false)
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSaved(false)
                    }
                >
                    Production cycle settings saved successfully.
                </Alert>

            </Snackbar>

        </>
    );

}

export default ShiftSettingsDialog;