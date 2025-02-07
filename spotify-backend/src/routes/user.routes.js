import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { uploadImage } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploadImage.single("profilePicture"), registerUser);

export default router;
