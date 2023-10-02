import React from "react";
import { SignIn, Register,MainPage } from ".";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { QueryClientProvider,queryClient  } from "../queryClient.js";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#9575cd",
    },
    secondary: {
      main: "#880e4f",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "& .MuiInputLabel-root": {
            color: "white", // Set the placeholder color to white
          },
          "& .MuiInputBase-input": {
            color: "white",
          }
        },
      },
    },
    MuiMenuItem:{
      styleOverrides:{
        root:{
          fontWeight:"bold"
        }
      }
    },
  },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .Mui-selected": {
            color: "primary", 
          },
      },
    },
  },
  typography: {

    allVariants: {
      color: "white",
    },
  },
});

export default function App() {

  
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Main" element={<MainPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </QueryClientProvider>
  );
}
