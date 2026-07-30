import UserModel from "../../models/userModel.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateResetOtp = async (request, response) => {
  const email = normalizeEmail(request.body.email);
  const resetOtp = normalizeText(request.body.resetOtp);

  if (!resetOtp) {
    return response.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  if (!/^\d{6}$/.test(resetOtp)) {
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

    const matchOtp = resetOtp === user.resetOtp;
    const currentDate = Date.now();
    const isExpired = currentDate > user.resetOtpExpireAt;

    if (!matchOtp) {
      return response.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (isExpired) {
      return response.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new password reset OTP",
      });
    }

    return response.status(200).json({
      success: true,
      message: "OTP verified successfully! Now enter your new password",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default validateResetOtp;
