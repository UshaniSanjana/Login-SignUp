import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import routes from "./routes/routes.js";

dotenv.config();

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
