import express, { request } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import login from "./controllers/Auth Controllers/login.js";
import refreshToken from "./controllers/Auth Controllers/refreshToken.js";
import signup from "./controllers/Auth Controllers/signup.js";
import verifyEmail from "./controllers/Auth Controllers/verifyEmail.js";
import resetOtp from "./controllers/Auth Controllers/resetOtp.js";
import validateResetOtp from "./controllers/Auth Controllers/validateResetOtp.js";
import resetPassword from "./controllers/Auth Controllers/resetPassword.js";

const app = express();

// CONSTANTS
const PORT = process.env.PORT || 5000;
const { MONGODB_URL, DB_PASSWORD, DATABASE_NAME, CLIENT_URL } = process.env;

if (!MONGODB_URL || !DB_PASSWORD || !DATABASE_NAME) {
  console.error("Missing required MongoDB environment variables");
  process.exit(1);
}

const mongoUrl = `${MONGODB_URL.replace("<db_password>", DB_PASSWORD)}/${DATABASE_NAME}`;

// MIDDLEWARES
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());

// CONSOLE LOGS
console.log("PORT", PORT);
console.log("DATABASE_NAME", DATABASE_NAME);

// MONGODB CONNECTION
connectDB(mongoUrl);

app.get("/", function (request, response) {
  response.status(200).json({
    success: true,
    message: "Task Management API is running",
  });
});

app.post("/signup", (request, response) => signup(request, response));
app.post("/login", (request, response) => login(request, response));
app.post("/verify-email", (request, response) =>
  verifyEmail(request, response),
);
app.post("/reset-otp", (request, response) => resetOtp(request, response));
app.post("/refreshtoken", (request, response) =>
  refreshToken(request, response),
);
app.post("/valiate-reset-otp", (request, response) =>
  validateResetOtp(request, response),
);
app.post("/reset-password", (request, response) =>
  resetPassword(request, response),
);

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  next(error);
});

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found",
  });
});

function listenCallBack() {
  console.log(`APP IS RUNNING ON PORT: ${PORT}`);
}

app.listen(PORT, listenCallBack);
