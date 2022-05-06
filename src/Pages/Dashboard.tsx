import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import PageHeader from "../Components/PageHeader";

const Dashboard: React.FunctionComponent = () => {
    const navigate = useNavigate();

    const handleClick = (path: string) => () => {
        navigate(path);
    };

    return (
        <Stack gap={4}>
            <Box>
                <PageHeader>Dashboard</PageHeader>
                <Typography>Checker support tools</Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardActionArea onClick={handleClick("/title/")}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    fontWeight="bold">
                                    Check Title/Meta
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    Checking Title and Meta informations
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardActionArea onClick={handleClick("/alt/")}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    fontWeight="bold">
                                    Check Alt
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    Check Alt attribute function
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardActionArea onClick={handleClick("/headline/")}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    fontWeight="bold">
                                    Check Headline
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    Checking Headline structure
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardActionArea onClick={handleClick("/link/")}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h6"
                                    component="div"
                                    fontWeight="bold">
                                    Check Link
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    Check Link target available
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Dashboard;
