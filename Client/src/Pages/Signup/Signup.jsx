import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./signup.scss";
import { useState } from "react";
import { Button, IconButton, InputAdornment } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import OtpInput from "../OtpInput/OtpInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useToast from "../../hooks/useToast";
import PasswordValidation from "../../Components/PasswordValidation/PasswordValidation";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setSignupDetails } from "../../store/appSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupEmailSent, setIsSignupEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const email = useSelector((state) => {
    return state.app.email;
  });

  const dispatch = useDispatch();
  const [validationError, setValidationError] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { showToast } = useToast();

  const passwordRegex =
    /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/;

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  function validateSignUpCredentials(form) {
    const errors = {
      username: "",
      email: "",
      password: "",
    };

    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

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
      username: !!errors.username,
      email: !!errors.email,
      password: !!errors.password,
    });

    return !Object.values(errors).some(Boolean);
  }

  function handleSignupChange(event) {
    const value = event.target.value;
    const sanitizedValue = value.replace(/\s/g, "");
    setSignupForm((prev) => {
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

  async function signup(event) {
    event.preventDefault();
    const isValid = validateSignUpCredentials(signupForm);

    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, signupForm);
      dispatch(setEmail(signupForm.email));
      dispatch(setSignupDetails(signupForm));
      console.log("SIGNUPFORM", signupForm);
      setSignupForm({
        username: "",
        email: "",
        password: "",
      });
      showToast(
        "success",
        "Account Created",
        response.data.message ||
          "Your account has been created. Check your email for the verification code.",
      );
      setIsSignupEmailSent(true);
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        "Signup Failed",
        error.response?.data?.message ||
          "We could not create your account right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="signup-parent">
        {!isSignupEmailSent ? (
          <Box
            component="form"
            className="signup-form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="on"
            onSubmit={signup}
          >
            <TextField
              id="outlined-password-input"
              label="Username"
              type="text"
              required
              value={signupForm.username}
              onChange={handleSignupChange}
              name="username"
              error={validationError.username}
              helperText={errorMessage.username}
            />
            <TextField
              id="outlined-password-input"
              label="Email"
              type="text"
              required
              value={signupForm.email}
              name="email"
              onChange={handleSignupChange}
              error={validationError.email}
              helperText={errorMessage.email}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              value={signupForm.password}
              name="password"
              onChange={handleSignupChange}
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
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <p>
              <Link to="/login">Already have an account ?</Link>
            </p>
            <PasswordValidation password={signupForm.password} />
          </Box>
        ) : (
          <OtpInput email={email} signup={signup} />
        )}
      </div>
    </>
  );
};

export default Signup;
