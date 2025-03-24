import { Router } from "express";
import {login,register} from "../Controllers/userManager.js"
const router = Router();
router.post("/login", login);
router.post("/register",register);
router.route("/add_to_activity");
router.route("/get_all_activity");
export default router;