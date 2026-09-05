import bcrypt from "bcryptjs";
import UserModel from "../../models/userModel.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";
import { decryptPassword } from "../../utils/passwordEncryption.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resetPassword = async (request, response) => {
  const email = normalizeEmail(request.body.email);
  const newPassword = normalizeText(
    decryptPassword(normalizeText(request.body.newPassword)),
  );
  const resetOtp = normalizeText(request.body.resetOtp);

  if (!resetOtp) {
    return response.status(400).json({
      success: false,
      message: "Please enter the reset code.",
    });
  }

  if (!/^\d{6}$/.test(resetOtp)) {
    return response.status(400).json({
      success: false,
      message: "Please enter the 6-digit code sent to your email.",
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

  if (!newPassword) {
    return response.status(400).json({
      success: false,
      message: "Please enter your new password.",
    });
  }

  if (newPassword.length < 8) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
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

    const matchOtp = resetOtp === user.resetOtp;
    const currentDate = Date.now();
    const isExpired = currentDate > user.resetOtpExpireAt;

    if (!matchOtp) {
      return response.status(400).json({
        success: false,
        message: "The reset code is incorrect.",
      });
    }

    if (isExpired) {
      return response.status(410).json({
        success: false,
        message: "This reset code has expired. Please request a new one.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    user.password = hashedPassword;
    user.refreshTokens = [];
    if (!user.isAccountVerified) {
      user.isAccountVerified = true;
    }
    await user.save();

    return response.status(200).json({
      success: true,
      message:
        "Your password has been reset. Please log in with your new password.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "We could not reset your password right now. Please try again.",
    });
  }
};

export default resetPassword;
