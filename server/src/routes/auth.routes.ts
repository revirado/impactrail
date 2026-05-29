import { Router } from "express";
import { getUsers, getUserById, login } from "../controllers/auth.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/login", login);

export default router;
