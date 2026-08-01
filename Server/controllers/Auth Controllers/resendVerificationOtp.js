import UserModel from "../../models/userModel.js";
import transporter from "./../../config/nodemailer.js";
import { normalizeEmail } from "../../utils/inputFields.js";

const OTP_EXPIRY_TIME = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resendVerificationOtp = async function (request, response) {
  const email = normalizeEmail(request.body.email);
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

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return response.status(404).json({
        success: false,
        message: "Account with this email does not exists",
      });
    }

    if (existingUser.isAccountVerified) {
      return response.status(400).json({
        success: false,
        message: "Account already verified. Please login using the credentials",
      });
    }

    const verifyOtp = String(Math.floor(100000 + Math.random() * 900000));

    existingUser.verifyOtp = verifyOtp;
    existingUser.verifyOtpExpireAt = Date.now() + OTP_EXPIRY_TIME * 60 * 1000;

    await existingUser.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Taskify - Verify Your Email",
      text: `Hello ${existingUser.username},

Welcome to Taskify! We're excited to have you on board.

To complete your account registration, please verify your email address using the One-Time Password (OTP) below:

Verification OTP: ${verifyOtp}

This OTP is valid for ${OTP_EXPIRY_TIME} minutes.

If you did not create a Taskify account, please ignore this email. No further action is required.

Thank you,
The Taskify Team`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(200).json({
      success: true,
      message:
        "OTP sent to your registered email, Please verify your email using the OTP.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default resendVerificationOtp;
