import { Router } from "express";
import { addNewSong, fetchSongByArtist } from "../controllers/song.controller";
import { uploadSong } from "../middleware/multer.middleware";

const router = Router();

router
  .route("/add-new-song")
  .post(
    uploadImage.single("songCoverImage"),
    uploadSong("songUrl"),
    addNewSong
  );
router.route("/fetch-song-by-artist/:artistId").get(fetchSongByArtist);

export default router;
