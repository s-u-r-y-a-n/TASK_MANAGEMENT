import bcrypt from "bcryptjs";
import UserModel from "../../models/userModel.js";
import transporter from "./../../config/nodemailer.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";
import { decryptPassword } from "../../utils/passwordEncryption.js";

const OTP_EXPIRY_TIME = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async function (request, response) {
  const username = normalizeText(request.body.username);
  const email = normalizeEmail(request.body.email);
  const password = normalizeText(
    decryptPassword(normalizeText(request.body.password)),
  );

  if (!username) {
    return response.status(400).json({
      success: false,
      message: "Please enter a username.",
    });
  }

  if (!email) {
    return response.status(400).json({
      success: false,
      message: "Please enter your email address.",
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
      message: "Please enter a password.",
    });
  }

  if (password.length < 8) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(409).json({
        success: false,
        message:
          "An account with this email already exists. Please log in instead.",
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

To complete your account registration, please verify your email address using the code below:

Verification code: ${verifyOtp}

This code is valid for ${OTP_EXPIRY_TIME} minutes.

If you did not create a Taskify account, please ignore this email. No further action is required.

Thank you,
The Taskify Team`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(201).json({
      success: true,
      message:
        "Your account has been created. Please verify your email using the code sent to your inbox.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "We could not create your account right now. Please try again.",
    });
  }
};

export default signup;
