import bcrypt from "bcryptjs";
import UserModel from "../../models/userModel.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";
import { createAuthTokens } from "../../utils/authUtils.js";

const changePassword = async function (request, response) {
  const email = normalizeEmail(request.body.email);
  const oldPassword = normalizeText(request.body.oldPassword);
  const newPassword = normalizeText(request.body.newPassword);

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

  if (!oldPassword) {
    return response.status(400).json({
      success: false,
      message: "Please enter your current password.",
    });
  }

  if (!newPassword) {
    return response.status(400).json({
      success: false,
      message: "Please enter a new password.",
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isAccountVerified = user.isAccountVerified;

    if (!isAccountVerified) {
      return response.status(403).json({
        success: false,
        message: "Please verify your email before changing your password.",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;

    await user.save();

    const { accessToken, refreshToken } = createAuthTokens(user);

    return response.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      message: "Your password has been changed successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "We could not change your password right now. Please try again.",
    });
  }
};

export default changePassword;
