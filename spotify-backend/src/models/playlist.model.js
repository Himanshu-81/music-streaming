import mongoose, { Schema } from "mongoose";

const playListSchema = await Schema(
  {
    name: {
      type: String,
      required: [true, "Playlist name is required"],
    },
    description: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: null, // Can store a URL for the playlist's cover image
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song", // References the Song model
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // Whether the playlist is public or private
    },
  },
  {
    timestamps: true,
  }
);

const PlayList = mongoose.model("PlayList", playListSchema);
