import UserModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const refreshToken = async (request, response) => {
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

export default refreshToken;
