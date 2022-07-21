import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Components
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import PageHeader from "../Components/PageHeader";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick = (path: string) => () => {
        navigate(path);
    };

    return (
        <Stack gap={4}>
            <PageHeader primary={t("apply.title")} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardActionArea onClick={handleClick("/title/")}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="body1"
                                    component="div"
                                    fontWeight="bold">
                                    {t("title.title")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {t("title.description")}
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
                                    variant="body1"
                                    component="div"
                                    fontWeight="bold">
                                    {t("alt.title")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {t("alt.description")}
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
                                    variant="body1"
                                    component="div"
                                    fontWeight="bold">
                                    {t("headline.title")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {t("headline.description")}
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
                                    variant="body1"
                                    component="div"
                                    fontWeight="bold">
                                    {t("link.title")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {t("link.description")}
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
