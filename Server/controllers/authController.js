import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import jwt from "jsonwebtoken";

const OTP_EXPIRY_TIME = 5;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createAuthTokens(user) {
  if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not configured");
  }

  const accessToken = jwt.sign(
    { email: user.email, id: user._id },
    JWT_ACCESS_SECRET,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: "24h",
  });

  return { accessToken, refreshToken };
}

export const signup = async function (request, response) {
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

export const login = async function (request, response) {
  const email = normalizeEmail(request.body.email);
  const password = normalizeText(request.body.password);

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
        message: "Account not verified. Please verify your email",
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
      message: "Logged in successfully",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (request, response) => {
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

export const refreshToken = async (request, response) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(401).json({
      success: false,
      message: "Authorization header is required",
    });
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      success: false,
      message: "Invalid authorization header format",
    });
  }

  const incomingRefreshToken = authorizationHeader.split(" ")[1];

  if (!incomingRefreshToken) {
    return response.status(401).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      JWT_REFRESH_SECRET,
    );

    const user = await UserModel.findById(decodedRefreshToken.id);

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const storedRefreshToken = user.refreshTokens.find(
      (token) => token === incomingRefreshToken,
    );

    if (!storedRefreshToken) {
      return response.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      createAuthTokens(user);

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== incomingRefreshToken,
    );

    user.refreshTokens.push(newRefreshToken);

    await user.save();

    return response.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      message: "Tokens generated successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(401).json({
        success: false,
        message: "Refresh token has expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return response.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetOtp = async (request, response) => {
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
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
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
      subject: "Taskify Password Reset OTP",
      text: `Hello ${user.username},

We received a request to reset the password for your Taskify account.

Your One-Time Password (OTP) is: ${passwordResetOtp}

This OTP is valid for ${OTP_EXPIRY_TIME} minutes. Please use it to complete your password reset.

If you did not request a password reset, you can safely ignore this email. Your account will remain secure.

Regards,
The Taskify Team`,
    };

    await transporter.sendMail(mailOptions);

    return response.status(200).json({
      success: true,
      message:
        "Password Reset OTP has been sent successfully. Please verify your email using the OTP sent to your inbox",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (request, response) => {
  const email = normalizeEmail(request.body.email);
  const newPassword = normalizeText(request.body.newPassword);
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

  if (!newPassword) {
    return response.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (newPassword.length < 8) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
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
        message: "OTP has expired. Please request a new password reset OTP",
      });
    }

    if (!validOtp) {
      return response.status(400).json({
        success: false,
        message: "Unable to verify OTP",
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
        "Password reset successfully. Please log in using your new password.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
