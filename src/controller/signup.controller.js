import Student from "../models/student.model.js";
import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["teacher", "student", "admin"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Inavalid user role" });
    }

    const teacher = await Teacher.findOne({ email });
    const student = await Student.findOne({ email });
    const admin = await Admin.findOne({ email });

    const userExist = teacher || student || admin;

    if (userExist) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (role.toLowerCase() == "student") {
      const userStudent = new Student({
        name,
        email,
        password: hashPassword,
      });
      await userStudent.save();
      return res.json({
        message: `Student ${userStudent.name} registered successfully`,
      });
    } else if (role.toLowerCase() == "teacher") {
      const userTeacher = new Teacher({
        name,
        email,
        password: hashPassword,
      });
      await userTeacher.save();
      return res.json({
        message: `Teacher ${userTeacher.name} registered successfully`,
      });
    } else if (role.toLowerCase() == "admin") {
      const userAdmin = new Admin({
        name,
        email,
        password: hashPassword,
      });
      await userAdmin.save();
      return res.json({
        message: `Admin ${userAdmin.name} registered successfully` ,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};
