import UserModel from "../../models/userModel.js";
import { normalizeEmail } from "../../utils/inputFields.js";
import transporter from "./../../config/nodemailer.js";

const OTP_EXPIRY_TIME = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resetOtp = async (request, response) => {
  const email = normalizeEmail(request.body.email);

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

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "No account was found with this email address.",
      });
    }

    const passwordResetOtp = String(
      Math.floor(100000 + Math.random() * 900000),
    );
    user.resetOtp = passwordResetOtp;
    user.resetOtpExpireAt = Date.now() + OTP_EXPIRY_TIME * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Taskify Password Reset Code",
      text: `Hello ${user.username},

We received a request to reset the password for your Taskify account.

Your password reset code is: ${passwordResetOtp}

This code is valid for ${OTP_EXPIRY_TIME} minutes. Please use it to complete your password reset.

If you did not request a password reset, you can safely ignore this email. Your account will remain secure.

Regards,
The Taskify Team`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(200).json({
      success: true,
      message:
        "A password reset code has been sent to your email.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "We could not send a password reset code right now. Please try again.",
    });
  }
};

export default resetOtp;
