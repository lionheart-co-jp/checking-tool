import React from "react";

// Components
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
    primary?: string;
    secondary?: string;
};
const PageHeader: React.FC<Props> = ({ primary, secondary }) => {
    return (
        <Stack gap={1}>
            {primary && (
                <Typography component="h2" variant="h5" fontWeight="bold">
                    {primary}
                </Typography>
            )}
            {secondary && <Typography>{secondary}</Typography>}
        </Stack>
    );
};

export default PageHeader;
