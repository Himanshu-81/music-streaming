import { Router } from "express";

import { registerNewArtist } from "../controllers/artist.controller.js";
import { uploadImage } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/register-artist")
  .post(uploadImage.single("artistProfilePicture"), registerNewArtist);

export default router;
