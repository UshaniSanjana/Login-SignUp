import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user, secretKey, role;

    if ((user = await Student.findOne({ email }))) {
      secretKey = process.env.JWT_SECRET_STUDENT;
      role = "student";
    } else if ((user = await Teacher.findOne({ email }))) {
      secretKey = process.env.JWT_SECRET_TEACHER;
      role = "teacher";
    } else if ((user = await Admin.findOne({ email }))) {
      secretKey = process.env.JWT_SECRET_ADMIN;
      role = "admin";
    } else {
      return res
        .status(400)
        .json({ message: "Invalid email. User does not exists" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({ message: `Invalid ${role} password` });
    }

    const token = jwt.sign({ id: user._id, role }, secretKey, {
      expiresIn: "1h",
    });

    return res.json({
      message: `${role.toUpperCase()} ${user.name} logged in successfully`,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error login", error: error.message });
  }
};
