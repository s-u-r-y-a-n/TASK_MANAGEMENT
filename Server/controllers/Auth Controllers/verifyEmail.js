import UserModel from "../../models/userModel.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";
import { createAuthTokens } from "../../utils/authUtils.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const verifyEmail = async (request, response) => {
  const otp = normalizeText(request.body.otp);
  const email = normalizeEmail(request.body.email);

  if (!otp) {
    return response.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return response.status(400).json({
      success: false,
      message: "Please enter the valid 6-digit OTP sent to your email",
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

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const isVerified = user.isAccountVerified;

    if (isVerified) {
      return response.status(409).json({
        success: false,
        message: "Account already verified. Please login",
      });
    }

    const matchOtp = otp === user.verifyOtp;
    const currentDate = Date.now();
    const isExpired = currentDate > user.verifyOtpExpireAt;
    const validOtp = matchOtp && !isExpired;

    if (!matchOtp) {
      return response.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (isExpired) {
      return response.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new verification OTP",
      });
    }

    if (!validOtp) {
      return response.status(400).json({
        success: false,
        message: "Unable to verify OTP",
      });
    }

    const { accessToken, refreshToken } = createAuthTokens(user);
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    user.refreshTokens.push(refreshToken);
    await user.save();

    return response.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      message: "Email verified successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyEmail;
