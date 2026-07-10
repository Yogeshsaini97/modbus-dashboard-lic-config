import {
    Paper,
    Typography,
    Box,
    Chip
} from "@mui/material";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function StatusWidget({

    icon,

    title,

    value,

    subtitle,

    color,

    unit

}) {

    return (

        <Paper

            elevation={0}

            sx={{

                height: 282,

                borderRadius: 4,

                overflow: "hidden",

                background: "#1E293B",

                border: "1px solid rgba(255,255,255,0.08)",

                transition: "all .35s ease",

                position: "relative",

                cursor: "pointer",

                "&:hover": {

                    transform: "translateY(-8px)",

                    boxShadow: "0 18px 40px rgba(0,0,0,.45)",

                    borderColor: color

                }

            }}

        >

            {/* Top Color Bar */}

            <Box

                sx={{

                    height: 6,

                    background: color

                }}

            />

            <Box

                sx={{

                    p: 3,

                    display: "flex",

                    flexDirection: "column",

                    justifyContent: "space-between",

                    height: "calc(100% - 6px)"

                }}

            >

                {/* Header */}

                <Box

                    display="flex"

                    justifyContent="space-between"

                    alignItems="center"

                >

                    <Typography

                        sx={{

                            fontSize: 13,

                            color: "#94A3B8",

                            fontWeight: 600,

                            letterSpacing: 1

                        }}

                    >

                        {title}

                    </Typography>

                    <Box

                        sx={{

                            color: color,

                            opacity: .9

                        }}

                    >

                        {icon}

                    </Box>

                </Box>

                {/* Value */}

                <Box mt={2}>

                    <Typography

                        sx={{

                            fontSize: 42,

                            fontWeight: 700,

                            lineHeight: 1,

                            color: "#fff"

                        }}

                    >

                        {value}

                        {unit && (

                            <Typography

                                component="span"

                                sx={{

                                    fontSize: 18,

                                    ml: 1,

                                    color: "#CBD5E1"

                                }}

                            >

                                {unit}

                            </Typography>

                        )}

                    </Typography>

                </Box>

                {/* Subtitle */}

                <Typography

                    sx={{

                        mt: 2,

                        color: "#CBD5E1",

                        fontSize: 14

                    }}

                >

                    {subtitle}

                </Typography>

                {/* Footer */}

                <Box

                    mt={3}

                    display="flex"

                    justifyContent="space-between"

                    alignItems="center"

                >

                    <Box

                        display="flex"

                        alignItems="center"

                        gap={1}

                    >

                        <FiberManualRecordIcon

                            sx={{

                                color: "#22C55E",

                                fontSize: 12,

                                animation: "pulse 1.8s infinite"

                            }}

                        />

                        <Typography

                            sx={{

                                fontSize: 12,

                                color: "#94A3B8"

                            }}

                        >

                            LIVE

                        </Typography>

                    </Box>

                    <Chip

                        label="Updated"

                        size="small"

                        sx={{

                            background: `${color}22`,

                            color: color,

                            fontWeight: 600,

                            border: `1px solid ${color}`

                        }}

                    />

                </Box>

            </Box>

        </Paper>

    );

}

export default StatusWidget;