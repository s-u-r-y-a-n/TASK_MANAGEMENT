import { Router } from "express";
import createList from "../controllers/Task List Controllers/createList.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import getTaskLists from "../controllers/Task List Controllers/getTaskLists.js";
import updateList from "../controllers/Task List Controllers/updateList.js";
import deleteList from "../controllers/Task List Controllers/deleteList.js";
import upload from "../middlewares/upload.js";
import createTask from "../controllers/Task Controllers/createTask.js";
import getTasksByListId from "../controllers/Task Controllers/getTasks.js";
import searchAndFilterTasks from "../controllers/Task Controllers/searchAndFilterTasks.js";
import deleteTask from "../controllers/Task Controllers/deleteTask.js";
import editTask from "../controllers/Task Controllers/editTask.js";
import dashboardMetrics from "../controllers/Task Controllers/dashboardMetrics.js";
import starredTasks from "../controllers/Task Controllers/starredTasks.js";
import toggleStarred from "../controllers/Task Controllers/toggleStarred.js";

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
router.get("/search-and-filter-tasks", authenticateToken, searchAndFilterTasks);
router.delete("/delete-task/:taskId", authenticateToken, deleteTask);
router.put(
  "/edit-task/:taskId",
  authenticateToken,
  upload.single("taskFile"),
  editTask,
);
router.get("/dashboard-metrics", authenticateToken, dashboardMetrics);
router.get("/starred-tasks", authenticateToken, starredTasks);
router.patch("/toggle-starred/:taskId", authenticateToken, toggleStarred);

export default router;
