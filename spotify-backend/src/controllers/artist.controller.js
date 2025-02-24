import { Artist } from "../models/artist.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerNewArtist = asyncHandler(async (req, res, next) => {
  const { name, bio, isVerified } = req.body;

  if (!name || !bio) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  const verifiedStatus = typeof isVerified === "boolean" ? isVerified : false;

  const existingArtist = await Artist.findOne({ name }).lean();
  if (existingArtist) {
    throw new ApiError(400, "An artist with this name already exists");
  }

  const artistProfilePicture = req?.file?.path;

  if (!artistProfilePicture) {
    throw new ApiError(400, "Artist profile picture is required");
  }

  const artistProfilePictureUrl = await uploadImage(
    artistProfilePicture,
    "Artist profile picture"
  );

  if (!artistProfilePictureUrl) {
    throw new ApiError(401, "Failed uploading the artist profile picture");
  }

  const createdArtist = await Artist.create({
    name,
    bio,
    artistProfilePicture: artistProfilePictureUrl,
    isVerified: verifiedStatus,
  });

  if (!createdArtist) {
    throw new ApiError(500, "Failed creating the artist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdArtist, "Artist registered successfully")
    );
});

export { registerNewArtist };
