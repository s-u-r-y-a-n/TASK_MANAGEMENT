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
      message: "Please enter the verification code.",
    });
  }

  if (!/^\d{6}$/.test(otp)) {
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

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "No account was found with this email address.",
      });
    }

    const isVerified = user.isAccountVerified;

    if (isVerified) {
      return response.status(409).json({
        success: false,
        message: "This account is already verified. Please log in.",
      });
    }

    const matchOtp = otp === user.verifyOtp;
    const currentDate = Date.now();
    const isExpired = currentDate > user.verifyOtpExpireAt;
    const validOtp = matchOtp && !isExpired;

    if (!matchOtp) {
      return response.status(400).json({
        success: false,
        message: "The verification code is incorrect.",
      });
    }

    if (isExpired) {
      return response.status(410).json({
        success: false,
        message: "This verification code has expired. Please request a new one.",
      });
    }

    if (!validOtp) {
      return response.status(400).json({
        success: false,
        message: "We could not verify this code. Please try again.",
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
      message: "Your email has been verified successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "We could not verify your email right now. Please try again.",
    });
  }
};

export default verifyEmail;
