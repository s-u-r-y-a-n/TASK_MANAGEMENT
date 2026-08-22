import { Router } from "express";
import createList from "../controllers/Task List Controllers/createList.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

router.post("/create-list", authenticateToken, createList);

export default router;
