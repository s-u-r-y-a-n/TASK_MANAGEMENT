import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./signup.scss";
import { useContext, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import OtpInput from "../OtpInput/OtpInput";
import { AppContext } from "../../Context/AppContext";
import PasswordValidation from "../../Components/PasswordValidation/PasswordValidation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { email, setEmail } = useContext(AppContext);
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

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/~`])[A-Za-z\d@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/~`]{8,}$/;

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
    setSignupForm((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });

    setErrorMessage((prev) => {
      return { ...prev, [event.target.name]: "" };
    });
    setValidationError((prev) => {
      return { ...prev, [event.target.name]: false };
    });

    if (event.target.name === "password") {
      validatePasswordPattern(event.target.value);
    }
  }

  async function signup(event) {
    event.preventDefault();
    const isValid = validateSignUpCredentials(signupForm);

    if (!isValid) return;
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, signupForm);
      setMessage(response.data.message || "Signup successful");
      setEmail(signupForm.email);
      setSignupForm({
        username: "",
        email: "",
        password: "",
      });
      setIsEmailSent(true);
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
      {!isEmailSent ? (
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
            id="outlined-password-input"
            label="Password"
            type="password"
            required
            value={signupForm.password}
            name="password"
            onChange={handleSignupChange}
            error={validationError.password}
            helperText={errorMessage.password}
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
          {message ? (
            <p className={isError ? "signup-message error" : "signup-message"}>
              {message}
            </p>
          ) : null}
        </Box>
      ) : (
        <OtpInput email={email} />
      )}

      <PasswordValidation password={signupForm.password} />
    </div>
  );
};

export default Signup;
