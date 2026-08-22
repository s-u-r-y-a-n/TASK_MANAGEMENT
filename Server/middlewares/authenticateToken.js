import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Unauthorized!" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or Expired Token!" });
    }
    console.log("Authenticated user:", user);
    req.user = user;
    next();
  });
};
