import React, { useEffect, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Consts
import { DRAWER_WIDTH } from "../Const/App";

// Components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import LanguageSwitch from "./LanguageSwitch";

// Icons
import MenuIcon from "@mui/icons-material/Menu";

// Atoms
import { useState as useLanguageState } from "../Atoms/Language";

type Props = React.ComponentProps<typeof ListItemButton> & {
    to: string;
};
const NavigationItem: React.FC<Props> = ({ to, children, ...props }) => {
    const match = useMatch(`${to}/*`);
    const navigate = useNavigate();

    const handleClick = (path: string) => () => {
        navigate(path);
    };

    return (
        <ListItemButton
            onClick={handleClick(to)}
            selected={match !== null}
            {...props}>
            {children}
        </ListItemButton>
    );
};

const Navigation: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const container =
        window !== undefined ? () => window.document.body : undefined;
    const [_, setLanguage] = useLanguageState();

    useEffect(() => {
        setLanguage(i18n.language);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const DrawerInner = () => {
        return (
            <List>
                <NavigationItem to="/">
                    <ListItemText primary={t("dashboard.title")}></ListItemText>
                </NavigationItem>
                <NavigationItem to="/title/">
                    <ListItemText primary={t("title.title")}></ListItemText>
                </NavigationItem>
                <NavigationItem to="/alt/">
                    <ListItemText primary={t("alt.title")}></ListItemText>
                </NavigationItem>
                <NavigationItem to="/headline/">
                    <ListItemText primary={t("headline.title")}></ListItemText>
                </NavigationItem>
                <NavigationItem to="/link/">
                    <ListItemText primary={t("link.title")}></ListItemText>
                </NavigationItem>
            </List>
        );
    };

    return (
        <>
            <AppBar
                position="fixed"
                color="inherit"
                sx={{ display: { sm: "none" } }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Checking Support Tool
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    anchor="left"
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: DRAWER_WIDTH,
                        },
                    }}>
                    <DrawerInner />
                    <Box sx={{ marginTop: "auto" }}>
                        <LanguageSwitch />
                    </Box>
                </Drawer>

                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: DRAWER_WIDTH,
                        },
                    }}>
                    <DrawerInner />
                    <Box sx={{ marginTop: "auto" }}>
                        <LanguageSwitch />
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default Navigation;
