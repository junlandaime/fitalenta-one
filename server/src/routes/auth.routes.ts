import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as passwordController from "../controllers/password.controller";
import { authenticate } from "../middlewares/authenticate";
import { verifyTurnstile } from "../middlewares/turnstile";
import { validate } from "../middlewares/validate";
import {
  changePasswordRateLimiter,
  emailVerificationRateLimiter,
  forgotPasswordEmailRateLimiter,
  forgotPasswordIpRateLimiter,
  loginAccountRateLimiter,
  loginIpRateLimiter,
  registerRateLimiter,
  resetPasswordRateLimiter,
} from "../middlewares/rateLimiter";
import {
  changePasswordRules,
  forgotPasswordRules,
  resetPasswordRules,
} from "../validators/password.validator";

const router = Router();

router.post("/register", registerRateLimiter, verifyTurnstile, authController.register);
router.post(
  "/login",
  loginIpRateLimiter,
  verifyTurnstile,
  loginAccountRateLimiter,
  authController.login
);
router.post("/verify-email", emailVerificationRateLimiter, authController.verifyEmailToken);
router.post(
  "/resend-verification",
  emailVerificationRateLimiter,
  verifyTurnstile,
  authController.resendVerificationEmail
);
router.post(
  "/forgot-password",
  forgotPasswordIpRateLimiter,
  verifyTurnstile,
  validate(forgotPasswordRules),
  forgotPasswordEmailRateLimiter,
  passwordController.forgot
);
router.post("/reset-password", resetPasswordRateLimiter, validate(resetPasswordRules), passwordController.reset);
router.post(
  "/change-password",
  authenticate,
  changePasswordRateLimiter,
  validate(changePasswordRules),
  passwordController.change
);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export default router;