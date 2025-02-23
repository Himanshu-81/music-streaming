import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/artist", artistRoutes);

app.use(errorHandler);

export default app;
