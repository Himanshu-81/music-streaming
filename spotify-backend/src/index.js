import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db/dbConnect.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
    process.exit(1);
  });
