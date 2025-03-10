import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import loginRoute from "./routes/login.js";
import signupRoute from "./routes/signUp.js";

dotenv.config();

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());

app.use("/api", loginRoute);
app.use("/api", signupRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
