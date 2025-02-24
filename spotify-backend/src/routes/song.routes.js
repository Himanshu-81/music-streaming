import { Router } from "express";
import {
  addNewSong,
  fetchSongByArtist,
} from "../controllers/song.controller.js";
import { uploadSong, uploadImage } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/add-new-song")
  .post(
    uploadImage.single("songCoverImage"),
    uploadSong.single("songUrl"),
    addNewSong
  );
router.route("/fetch-song-by-artist/:artistId").get(fetchSongByArtist);

export default router;
