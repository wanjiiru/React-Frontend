import React, { Component } from "react";
import { Player } from '@lottiefiles/react-lottie-player';
import Joi from 'joi-browser';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getLocalStorageItem, postApiData, setLocalStorageItem } from "../services/httpService";
// import statistics from "../static/statistics.svg";
// import loginArt from "../static/loginArt.json";
// import { signJWT } from "../services/jwtService";

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Login extends Component{
    state = {
        formData:{
            username:"",
            password:"",
        },
        showPassword:false,
        errors:{},
    }
    loginSchema = {
        username: Joi.string()
          .required()
          .label('Username'),
        password: Joi.string()
          .required()
          .label('Password'),
    };
    validate = (formData) => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(formData, this.loginSchema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details)
          if (!errors[item.path[0]]) errors[item.path[0]] = item.message;
        return errors;
      };
    componentDidMount(){
        document.title = "Login - Lead Conversion";
        if (getLocalStorageItem("Token"))
            window.location = "/";
        console.log(this.props);
    }
    handleChange = ({target}) => {
        let { formData, errors } = this.state;
        formData[target.name] = target.value;
        errors[target.name] && delete errors[target.name];
        this.setState({ formData, errors });
    }
    handleClickShowPassword = () =>{
        let { showPassword } = this.state;
        this.setState({ showPassword:!showPassword });
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        let { formData, errors } = this.state;
        const errorCheck = this.validate(formData);
        if (errorCheck){
            this.setState({ errors: errorCheck });
            return;
        }
        try{
            const { status, data } = await postApiData('api/login/', formData);
            console.log(data, status);
            if (status === 200){
                setLocalStorageItem("Token", `Token ${data.token}`);
                this.props.handleOpenToast("Login success! Welcome", "success");
                await sleep(2000);
                const { state } = this.props.location;
                window.location = state ? state.from.pathname : '/';
            }
            else {
                this.props.handleOpenToast(data.non_field_errors[0], "error");
                formData.username = "";
                formData.password = "";
                errors.username = " ";
                errors.password = "Invalid username or password";
                this.setState({ formData, errors });
            }
        } catch(err) {
            this.props.handleOpenToast("Check internet connection", "error");
        }
    }
    render(){
        const { formData, showPassword, errors } = this.state;
        return(
            <Grid container spacing={2} sx={{ height:window.innerHeight+16 }}>
                <Grid item xs={4} md={4} sx={{ display: "flex", justifyContent:"center", alignItems:"center", backgroundColor:"white" }}>
                    <Box component="form" sx={{ width:"25rem", display: "flex", flexDirection: "column" }} onSubmit={this.handleSubmit}>
                        <Typography gutterBottom variant="h4" sx={{ textAlign:"center" }}>Sign In</Typography>
                        <Typography gutterBottom variant="p" className="light-font" sx={{ marginBottom:"0.7rem" }}>Please enter your username and password</Typography>
                        <Typography gutterBottom variant="p" sx={{ fontWeight:600 }}>Username:</Typography>
                        <TextField id="id_username"
                            label="Username"
                            name="username"
                            sx={{ marginBottom:"1rem" }}
                            onChange={this.handleChange}
                            value={formData.username}
                            size="small"
                            InputProps={{
                                sx: {
                                    borderRadius:"9px",
                                    fontSize:"12px",
                                    '& .MuiOutlinedInput-notchedOutline':{
                                        fontSize: '12px',
                                    }
                                },
                                size:"small"
                            }}
                            InputLabelProps={{
                                sx:{
                                    fontSize:"12px",
                                }
                            }}
                            FormHelperTextProps={{
                                sx:{
                                    fontSize: "10px"
                                }
                            }}
                            error={errors.username ? true : false}
                            helperText={errors.username ? errors.username : ""}
                        />
                        <Typography gutterBottom variant="p" sx={{ fontWeight:600 }}>Password:</Typography>
                        <FormControl error={errors.password ? true : false} variant="outlined" size="small" sx={{ marginBottom:"1rem" }}>
                            <InputLabel htmlFor="id_password" sx={{ fontSize:"12px" }}>Password</InputLabel>
                            <OutlinedInput id="id_password" type={showPassword ? 'text' : 'password'}
                                label="Password"
                                value={formData.password}
                                onChange={this.handleChange}
                                name="password"
                                sx={{
                                    fontSize:"12px",
                                    borderRadius:"9px"
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                        edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.password ? <FormHelperText id="component-error-text" sx={{ fontSize:"10px" }}>{errors.password}</FormHelperText> : null}
                        </FormControl>
                        <Button variant="contained" className="outline-button heavy-font" type="submit">Sign In</Button>
                    </Box>
                </Grid>
                <Grid item xs={8} md={8} sx={{ display: "flex", justifyContent:"center", alignItems:"center", flexDirection:"column", borderLeft:"1px solid #8080803b" }}>
                    {/* <h2 className="heavy-font">Incident Management Portal</h2> */}
                    {/* <img src={statistics} alt="browser-loading" width="70%"/> */}
                    {/* <Player autoplay speed={0.5}
                        loop={true}
                        src={loginArt}
                        style={{ width: '100%' }}
                    /> */}
                </Grid>
            </Grid>
        )
    }
}
export default Login;