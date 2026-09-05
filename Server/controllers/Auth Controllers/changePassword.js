import bcrypt from "bcryptjs";
import UserModel from "../../models/userModel.js";
import { normalizeText } from "../../utils/inputFields.js";
import { decryptPassword } from "../../utils/passwordEncryption.js";

const changePassword = async function (request, response) {
  const user = request.user;
  const oldPassword = normalizeText(
    decryptPassword(normalizeText(request.body.oldPassword)),
  );
  const newPassword = normalizeText(
    decryptPassword(normalizeText(request.body.newPassword)),
  );

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

  if (newPassword.length < 8) {
    return response.status(400).json({
      success: false,
      message: "New password must be at least 8 characters long.",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email: user.email });
    if (!existingUser) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);

    if (!isMatch) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isAccountVerified = existingUser.isAccountVerified;

    if (!isAccountVerified) {
      return response.status(403).json({
        success: false,
        message: "Please verify your email before changing your password.",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    existingUser.password = newPasswordHash;

    await existingUser.save();

    return response.status(200).json({
      success: true,
      message: "Your password has been changed successfully.",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return response.status(500).json({
      success: false,
      message: "We could not change your password right now. Please try again.",
    });
  }
};

export default changePassword;
