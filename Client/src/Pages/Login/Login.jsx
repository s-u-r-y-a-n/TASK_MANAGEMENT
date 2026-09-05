import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.scss";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { API_BASE_URL } from "../../utils/apiConfig.js";

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState({
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/;

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  function handleLoginChange(event) {
    const value = event.target.value;
    const sanitizedValue = value.replace(/\s/g, "");

    setLoginForm((prev) => {
      return {
        ...prev,
        [event.target.name]: sanitizedValue,
      };
    });

    setErrorMessage((prev) => {
      return { ...prev, [event.target.name]: "" };
    });
    setValidationError((prev) => {
      return { ...prev, [event.target.name]: false };
    });
  }

  function validateLoginCredentials(form) {
    const errors = {
      email: "",
      password: "",
    };

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      errors.password =
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    setErrorMessage(errors);

    setValidationError({
      email: !!errors.email,
      password: !!errors.password,
    });

    return !Object.values(errors).some(Boolean);
  }

  async function login(event) {
    event.preventDefault();
    const isValid = validateLoginCredentials(loginForm);

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginForm);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setLoginForm({
        email: "",
        password: "",
      });
      showToast(
        "success",
        "Logged In",
        response.data.message || "You have been logged in successfully.",
      );
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        "Login Failed",
        error.response?.data?.message ||
          "We could not log you in. Please check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-parent">
      <Box
        component="form"
        className="login-form"
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
          error={validationError.email}
          helperText={errorMessage.email}
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          value={loginForm.password}
          onChange={handleLoginChange}
          name="password"
          error={validationError.password}
          helperText={errorMessage.password}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          color="success"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <p className="login-btns">
          <Link to="/">Don't have an account ?</Link>
          <Link to="/reset-password">Forgot Password ?</Link>
        </p>
      </Box>
    </div>
  );
};

export default Login;
