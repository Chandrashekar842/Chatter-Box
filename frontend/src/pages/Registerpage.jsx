import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    nameErr: "",
    emailErr: "",
    passwordErr: "",
  });

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await axios.post('https://chatter-box-backend-2stj.onrender.com/auth/register', {
        name: userName,
        email: email,
        password: password,
      });
      if (response) {
        navigate("/login");
      }
      setErrorMessages({ nameErr: "", passwordErr: "", mailErr: "" });
    } catch (error) {
      // console.log("Error while creating user", error)
      if (error.response?.data) {
        const errorArray = error.response.data.err;
        const newErrorMessages = {
          nameErr: "",
          emailErr: "",
          passwordErr: "",
        };
        errorArray.forEach((err) => {
          if (err.path === "name") {
            newErrorMessages.nameErr = err.msg;
          } else if (err.path === "email") {
            newErrorMessages.emailErr = err.msg;
          } else if (err.path === "password") {
            newErrorMessages.passwordErr = err.msg;
          }
        });
        setErrorMessages(newErrorMessages);
      }
    }
    setLoading(false)
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#F5FFFA",
          padding: 4,
          borderRadius: 7,
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="userName"
                label="User Name"
                autoFocus
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {errorMessages.nameErr && (
            <Typography sx={{ color: "red" }}>
              {errorMessages.nameErr}
            </Typography>
          )}
          {errorMessages.emailErr && (
            <Typography sx={{ color: "red" }}>
              {errorMessages.emailErr}
            </Typography>
          )}
          {errorMessages.passwordErr && (
            <Typography sx={{ color: "red" }}>
              {errorMessages.passwordErr}
            </Typography>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Box sx={{ width: '100%', textAlign: 'center' }}>{loading && <CircularProgress />}</Box>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
