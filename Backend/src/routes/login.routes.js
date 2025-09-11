import express from 'express';
import { login, logout } from "../controllers/login.controller.js";
import { verifyUserOrAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.route("/login").post(login)

router.route("/logout").post(verifyUserOrAdmin, logout)



export default router