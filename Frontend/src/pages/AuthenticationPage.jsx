import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { userContext } from "../context/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function AuthenticationPage() {
  // State to switch between login and register
  const [tabValue, setTabValue] = React.useState(0);
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle tab switch (Login / Register)
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle input change and update state
  const handleChange = (event) => {
    seterror(null)
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [error, seterror] = React.useState(null);
  const { setusername } = useContext(userContext);
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (tabValue === 0) {
      axios
        .post("http://localhost:8000/login", formData, {
          withCredentials: true,
        })
        .then(() => {
          axios.get("http://localhost:8000/userdata",{withCredentials:true}).then((res) => {
            setusername(res.data.message);
          });
          navigate("/");
        })
        .catch((err) => {
          seterror(err.response.data.message);
        });
    } else {
        axios
        .post("http://localhost:8000/register", formData, {
          withCredentials: true,
        })
        .then(() => {
          axios.get("http://localhost:8000/userdata",{withCredentials:true}).then((res) => {
            setusername(res.data.message);
          });
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          seterror(err.response.data.message);
        });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        {/* Left Side - Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage:
              "url(https://imgs.search.brave.com/c95N3PvmtdxBMJSIIjlQi2jlJv5RUcWC93jxPcfnG5U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2UyLzFh/Lzk3L2UyMWE5NzFl/ODljNDU2NGVmZTg2/Mjg0OGZmYzY5MzQz/LmpwZw)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Right Side - Form */}
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
              {tabValue === 0 ? "Sign In" : "Sign Up"}
            </Typography>
            {/* Tab Switcher */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            {/* Form Content */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              {tabValue === 0 ? (
                // Login Form
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  {error ? <p style={{ color: "red" }}>{error}</p> : <p></p>}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                // Register Form
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Full Name"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {error ? <p style={{ color: "red" }}>{error}</p> : <p></p>}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
