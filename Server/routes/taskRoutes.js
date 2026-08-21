import { Router } from "express";
import createList from "../controllers/Task List Controllers/createList.js";

const router = Router();

router.post("/create-list", createList);

export default router;
