import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

// Icons
import LanguageIcon from "@mui/icons-material/Language";

// Atoms
import { useState as useLanguageState } from "../Atoms/Language";

const LanguageSwitch: React.FC = () => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [language, setLanguage] = useLanguageState();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectLanguage = (lng: string) => {
        return () => {
            i18n.changeLanguage(lng);
            setLanguage(lng);
            localStorage.setItem("lng", lng);
            handleClose();
        };
    };

    const open = Boolean(anchorEl);
    const id = open ? "language-popover" : undefined;

    return (
        <Box sx={{ p: 1 }}>
            <IconButton aria-describedby={id} onClick={handleClick}>
                <LanguageIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}>
                <List>
                    <ListItemButton onClick={selectLanguage("en")}>
                        English
                    </ListItemButton>
                    <ListItemButton onClick={selectLanguage("ja")}>
                        日本語
                    </ListItemButton>
                </List>
            </Popover>
        </Box>
    );
};

export default LanguageSwitch;
