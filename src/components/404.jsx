import React from "react";
import { Player } from '@lottiefiles/react-lottie-player';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
// import notFound from "../static/404.json";

const NotFound = () => {
    document.title="404 - Not Found"
    return (
        <Container maxWidth="lg" sx={{ display:"flex", marginBottom: "1rem", paddingBottom:"2rem", height:window.innerHeight+16 }} >
            <Grid container rowSpacing={2} sx={{ flexGrow: 1 }} style={{ paddingLeft:"0rem", paddingTop:"0rem" }}>
                <Grid item xs={12} md={12} sx={{ flexGrow: 1, display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column" }} >
                    <Button variant="text" href="/" sx={{ marginTop:"3rem", textTransform:"none" }}> <ArrowBackRoundedIcon /> Back to Dashboard</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default NotFound;