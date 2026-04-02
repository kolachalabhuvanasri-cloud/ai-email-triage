import { Router } from "express";
import { listActivityLogs } from "../controllers/activity.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const activityRouter = Router();

activityRouter.get("/activity-logs", requireAuth, requireRole("admin"), asyncHandler(listActivityLogs));
