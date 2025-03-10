import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["teacher", "student", "admin"].includes(role)) {
      return res.status(400).json({ message: "Inavalid user role" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashPassword, role });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

export default router;
