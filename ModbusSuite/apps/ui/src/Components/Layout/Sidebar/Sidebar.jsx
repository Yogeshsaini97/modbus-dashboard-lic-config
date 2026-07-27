import {

    Box,

    List,

    ListItemButton,

    ListItemIcon,

    ListItemText,

    Typography

} from "@mui/material";

import navigation from "../../config/navigation";

function Sidebar() {

    return (

        <Box

            sx={{

                width: 260,

                height: "100vh",

                background: "#111827",

                borderRight: "1px solid #334155",

                display: "flex",

                flexDirection: "column"

            }}

        >

            <Box

                sx={{

                    p: 3,

                    borderBottom: "1px solid #334155"

                }}

            >

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    Vansh Industries

                </Typography>

                <Typography

                    variant="body2"

                    color="gray"

                >

                    Industrial Monitoring

                </Typography>

            </Box>

            <List sx={{ mt: 2 }}>

                {

                    navigation.map(item => {

                        const Icon = item.icon;

                        return (

                            <ListItemButton
                                key={item.title}
                            >

                                <ListItemIcon>

                                    <Icon />

                                </ListItemIcon>

                                <ListItemText

                                    primary={item.title}

                                />

                            </ListItemButton>

                        );

                    })

                }

            </List>

            <Box

                sx={{

                    mt: "auto",

                    p: 2,

                    borderTop: "1px solid #334155"

                }}

            >

                <Typography

                    variant="caption"

                    color="gray"

                >

                    Powered by

                </Typography>

                <Typography

                    fontWeight="bold"

                >

                    Saini Enterprises

                </Typography>

            </Box>

        </Box>

    );

}

export default Sidebar;