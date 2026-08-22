import jwt from "jsonwebtoken";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const createAuthTokens = (user) => {
  if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not configured");
  }

  const accessToken = jwt.sign(
    { email: user.email, id: user._id },
    JWT_ACCESS_SECRET,
    { expiresIn: "24h" },
  );
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: "24h",
  });

  return { accessToken, refreshToken };
};
