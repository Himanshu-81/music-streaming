import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { uploadImage } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploadImage.single("profilePicture"), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);

router.route("/verify-email").post(verifyEmail);

export default router;
