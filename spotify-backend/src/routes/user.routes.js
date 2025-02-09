import { Router } from "express";
import { registerUser, verifyEmail } from "../controllers/user.controller.js";
import { uploadImage } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploadImage.single("profilePicture"), registerUser);

router.route("/verify-email").post(verifyEmail);

export default router;
