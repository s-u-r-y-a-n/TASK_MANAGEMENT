export const createAuthTokens = (user) => {
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
};
