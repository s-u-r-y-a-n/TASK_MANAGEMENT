import bcrypt from "bcryptjs";
import UserModel from "../../models/userModel.js";
import transporter from "./../../config/nodemailer.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";

const OTP_EXPIRY_TIME = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async function (request, response) {
  const username = normalizeText(request.body.username);
  const email = normalizeEmail(request.body.email);
  const password = normalizeText(request.body.password);

  if (!username) {
    return response.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  if (!email) {
    return response.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return response.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (!password) {
    return response.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (password.length < 8) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyOtp = String(Math.floor(100000 + Math.random() * 900000));
    const verifyOtpExpireAt = Date.now() + OTP_EXPIRY_TIME * 60 * 1000;

    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyOtp,
      verifyOtpExpireAt,
    });

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Taskify - Verify Your Email",
      text: `Hello ${user.username},

Welcome to Taskify! We're excited to have you on board.

To complete your account registration, please verify your email address using the One-Time Password (OTP) below:

Verification OTP: ${verifyOtp}

This OTP is valid for ${OTP_EXPIRY_TIME} minutes.

If you did not create a Taskify account, please ignore this email. No further action is required.

Thank you,
The Taskify Team`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(201).json({
      success: true,
      message:
        "Account created successfully. Please verify your email using the OTP sent to your inbox",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default signup;
