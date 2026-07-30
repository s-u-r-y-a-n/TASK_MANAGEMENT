import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./signup.scss";
import { useContext, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import OtpInput from "../OtpInput/OtpInput";
import { AppContext } from "../../Context/AppContext";

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

  function handleSignupChange(event) {
    setSignupForm((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function signup(event) {
    event.preventDefault();
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

  console.log("EMAIL", email);

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
          />
          <TextField
            id="outlined-password-input"
            label="Email"
            type="text"
            required
            value={signupForm.email}
            name="email"
            onChange={handleSignupChange}
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            required
            value={signupForm.password}
            name="password"
            onChange={handleSignupChange}
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
    </div>
  );
};

export default Signup;
