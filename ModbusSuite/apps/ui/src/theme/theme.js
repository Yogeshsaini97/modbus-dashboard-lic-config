import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        mode: "dark",

        primary: {
            main: "#2563EB"
        },

        success: {
            main: "#22C55E"
        },

        warning: {
            main: "#F59E0B"
        },

        error: {
            main: "#EF4444"
        },

        background: {

            default: "#0B1120",

            paper: "#1E293B"

        }

    },

    shape: {

        borderRadius: 12

    },

    typography: {

        fontFamily: "Inter, sans-serif",

        h4: {

            fontWeight: 700

        },

        h6: {

            fontWeight: 600

        }

    }

});

export default theme;