import React from "react";

// Components
import Typography from "@mui/material/Typography";

const PageHeader: React.FunctionComponent<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <Typography component="h2" variant="h5" fontWeight="bold">
            {children}
        </Typography>
    );
};

export default PageHeader;
