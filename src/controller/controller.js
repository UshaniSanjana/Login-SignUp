import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const matchPssword = await bcrypt.compare(password, user.password);
    if (!matchPssword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Login successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error login", error: error.message });
  }
};

export const signup = async (req, res) => {
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
};
