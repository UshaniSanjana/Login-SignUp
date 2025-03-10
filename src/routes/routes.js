import express from "express";
import { login } from "../controller/controller.js";
import { signup } from "../controller/controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

export default router;
