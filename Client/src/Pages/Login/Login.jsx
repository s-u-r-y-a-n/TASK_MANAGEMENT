import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import "../Signup/signup.scss"
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleLoginChange(event) {
    setLoginForm((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function login(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginForm);
      setMessage(response.data.message || "Signup successful");
      setLoginForm({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Unable to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="signup-parent">
      <Box
        component="form"
        className="signup-form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="on"
        onSubmit={login}
      >
        <TextField
          id="outlined-password-input"
          label="Email"
          type="text"
          required
          value={loginForm.email}
          onChange={handleLoginChange}
          name="email"
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="text"
          required
          value={loginForm.password}
          onChange={handleLoginChange}
          name="password"
        />
        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging..." : "Login"}
        </Button>
        {message ? (
          <p className={isError ? "signup-message error" : "signup-message"}>
            {message}
          </p>
        ) : null}
      </Box>
    </div>
  );
};

export default Login;
