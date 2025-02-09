import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: [true, "Username already exists"],
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    profilePicture: { type: String, default: null },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    verificationTokenExpiry: {
      type: Date,
    },

    refreshToken: {
      type: String,
    },

    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals in JSON responses
    toObject: { virtuals: true },
  }
);

userSchema.virtual("playlistCount").get(function () {
  return this.playlists.length;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

// code to use for the defaul playlist of the user

// const defaultPlaylist = new Playlist({
//   name: "Liked Songs",
//   createdBy: savedUser._id, // Associate with the user's ID
//   isPublic: false,
//   songs: [],
// });
// await defaultPlaylist.save();

// code to access the liked song

// const user = await User.findById(userId).populate("likedSongPlayList");
// console.log(user.likedSongs); // Outputs the number of liked songs

// const user = await User.findById(userId);
// console.log(user.likedSongPlayList); // [ObjectId1, ObjectId2, ObjectId3]
// console.log(user.likedSongs); // 3
