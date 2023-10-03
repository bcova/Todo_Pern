import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import { Container } from "@mui/material";
import Logo from "../assets/Daily.svg";
import { loginUser } from "../Api/usersApi";
import { useNavigate } from 'react-router-dom';
import { gsap } from "gsap";
export const SignIn = () => {
  const navigateTo = useNavigate(); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");
    const login = await loginUser(username, password);
    if(login.data.Valid) {
      sessionStorage.setItem('user', JSON.stringify(login.data.user,));
      sessionStorage.setItem('token',login.data.token);
      navigateTo('/Main')
  }}

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
          DailyDo
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  useEffect(() => {
gsap.fromTo(".logo", { x: -1500}, { x: 0, duration: 1, delay: 0.3, ease: "power2" });
  },[]);

  return (

      <Container disableGutters sx={{ bgcolor:'secondary.main' }}>
        <Grid
          container
          component="main"
          sx={{ height: "100vh", placeContent: "center" }}
          p={2}
        >
         
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                `url(${Logo})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
            }}
           className="logo"
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{ borderRadius: 2 }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <LockOutlinedIcon color="red" />
              </Avatar>
              <Typography color={"primary.main"} component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoFocus
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
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
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  sx={{'.MuiTypography-root': {color: 'black'}}}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign in
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
  );
};

export default SignIn;