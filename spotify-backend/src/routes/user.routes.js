import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getUserProfile,
  changeUserPassword,
} from "../controllers/user.controller.js";
import { uploadImage } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploadImage.single("profilePicture"), registerUser);

router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/profile").get(verifyJwt, getUserProfile);
router.route("/change-password").post(verifyJwt, changeUserPassword);

router.route("/verify-email").post(verifyEmail);

export default router;
