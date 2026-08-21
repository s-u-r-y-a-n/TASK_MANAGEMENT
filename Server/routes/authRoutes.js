import { Router } from "express";
import login from "../controllers/Auth Controllers/login.js";
import refreshToken from "../controllers/Auth Controllers/refreshToken.js";
import signup from "../controllers/Auth Controllers/signup.js";
import verifyEmail from "../controllers/Auth Controllers/verifyEmail.js";
import resetOtp from "../controllers/Auth Controllers/resetOtp.js";
import validateResetOtp from "../controllers/Auth Controllers/validateResetOtp.js";
import resetPassword from "../controllers/Auth Controllers/resetPassword.js";
import resendVerificationOtp from "../controllers/Auth Controllers/resendVerificationOtp.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/reset-otp", resetOtp);
router.post("/refreshtoken", refreshToken);
router.post("/valiate-reset-otp", validateResetOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-verification-otp", resendVerificationOtp);

export default router;
