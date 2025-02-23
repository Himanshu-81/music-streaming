import { Song } from "../models/song.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImage, uploadSong } from "../utils/cloudinary";
import { Artist } from "../models/artist.model.js";

const addNewSong = asyncHandler(async (req, res, next) => {
  const { songName, genre, artist } = req.body;

  if (!songName || !genre || !artist) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  if (!mongoose.Types.ObjectId.isValid(artist)) {
    throw new ApiError(400, "Invalid artist ID.");
  }

  const existingArtist = await Artist.findById(artist);

  if (!existingArtist) {
    throw new ApiError(404, "Artist not found.");
  }

  if (!req.files || !req.files.songCoverImage || !req.files.songFile) {
    throw new ApiError(
      400,
      "Both song cover image and song file are required."
    );
  }

  const songCoverImageLocalPath = req.files.songCoverImage[0].path;

  const songUrlLocalPath = req.files.songFile[0].path;

  const songCoverImageUrl = await uploadImage(
    songCoverImageLocalPath,
    "Song cover image"
  );

  if (!songCoverImageUrl) {
    throw new ApiError(401, "Failed uploading the song cover image");
  }

  const songUrl = await uploadSong(songUrlLocalPath);

  if (!songUrl) {
    throw new ApiError(401, "Failed uploading the song");
  }

  const addedSong = await Song.create({
    songName,
    genre,
    artist,
    songCoverImage: songCoverImageUrl,
    songUrl,
  });

  if (!addedSong) {
    throw new ApiError(500, "Failed adding the song");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, addedSong, "Song added successfully"));
});

const fetchSongByArtist = asyncHandler(async (req, res, next) => {
  const { artistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(artistId)) {
    throw new ApiError(400, "Invalid artist ID format");
  }

  if (!artistId) {
    throw new ApiError(400, "Please provide the artist ID");
  }

  const artist = await Artist.findById(artistId);

  if (!artist) {
    throw new ApiError(404, "Artist not found");
  }

  const songs = await Song.find({ artist: artistId }).populate("artist");

  if (!songs) {
    throw new ApiError(404, "No songs found for the artist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, songs, "Songs fetched successfully for the artist")
    );
});

export { addNewSong, fetchSongByArtist };
