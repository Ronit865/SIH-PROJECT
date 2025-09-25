import dotenv from "dotenv";
import connectDB from "./db/server.js";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
  debug: false
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
        // console.log("Database connection established successfully.");
    })
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  });