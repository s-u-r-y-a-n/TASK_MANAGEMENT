import bcrypt from "bcryptjs";
import UserModel from "../../models/userModel.js";
import { normalizeEmail, normalizeText } from "../../utils/inputFields.js";
import { createAuthTokens } from "../../utils/authUtils.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const login = async function (request, response) {
  const email = normalizeEmail(request.body.email);
  const password = normalizeText(request.body.password);

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
      message: "Please enter your password.",
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

    const isAccountVerified = user.isAccountVerified;

    if (!isAccountVerified) {
      return response.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = createAuthTokens(user);

    user.refreshTokens.push(refreshToken);

    await user.save();

    return response.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      message: "You have been logged in successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "We could not log you in right now. Please try again.",
    });
  }
};

export default login;
