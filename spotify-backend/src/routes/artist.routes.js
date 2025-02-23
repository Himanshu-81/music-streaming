import { Router } from "express";

import { registerNewArtist } from "../controllers/artist.controller";
import { uploadImage } from "../middleware/multer.middleware";

const router = Router();

router
  .route("/register-artist")
  .post(uploadImage("artistProfilePicture"), registerNewArtist);

export default router;
