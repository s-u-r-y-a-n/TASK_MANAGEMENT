import { Router } from "express";
import createList from "../controllers/Task List Controllers/createList.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import getTaskLists from "../controllers/Task List Controllers/getTaskLists.js";
import updateList from "../controllers/Task List Controllers/updateList.js";
import deleteList from "../controllers/Task List Controllers/deleteList.js";
import upload from "../middlewares/upload.js";
import createTask from "../controllers/Task Controllers/createTask.js";
import getTasksByListId from "../controllers/Task Controllers/getTasks.js";

const router = Router();

router.post("/create-list", authenticateToken, createList);
router.get("/get-tasklists", authenticateToken, getTaskLists);
router.put("/update-list/:listId", authenticateToken, updateList);
router.delete("/delete-list/:listId", authenticateToken, deleteList);
router.post(
  "/create-task",
  authenticateToken,
  upload.single("taskFile"),
  createTask,
);
router.get("/fetch-tasks/:listId", authenticateToken, getTasksByListId);

export default router;
