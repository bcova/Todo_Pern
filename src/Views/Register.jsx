import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { registerUser } from "../Api/usersApi";
import { useNavigate } from 'react-router-dom';
function Copyright(props) {
  
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Register() {
  const navigateTo = useNavigate();
  const handleSubmit = async  (event) => {
    event.preventDefault(); 
  const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");
    const newUser = await registerUser(username, password);
    console.log({newUser});
    if (!newUser.success) {
      console.log("Error:", newUser.error.error);
    } else {
      sessionStorage.setItem('user', JSON.stringify(newUser.data.userInfo));
      sessionStorage.setItem('token',newUser.data.token);
      navigateTo('/')
    }
  };

  return (
    <Container  component="main" sx={{ bgcolor:'secondary.main',
    height:'100vh', width:'100vw',display :'flex',justifyContent:'center',alignItems:'center', flexDirection:'column' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"primary.main"}>
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                sx={{      "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "& .MuiInputLabel-root": {
            color: "black",
          },
          "& .MuiInputBase-input": {
            color: "black",
          }}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                sx={{      "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "& .MuiInputLabel-root": {
            color: "black",
          },
          "& .MuiInputBase-input": {
            color: "black",
          }}}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
}
