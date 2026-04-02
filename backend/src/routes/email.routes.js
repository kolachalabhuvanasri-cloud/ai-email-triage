import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateTriageRequest, validateUpdateEmail } from "../middleware/validate.js";
import { getEmail, listEmailsController, patchEmail, runTriage } from "../controllers/email.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { captureEmailViewActivity } from "../middleware/activity.js";

export const emailRouter = Router();

emailRouter.use(requireAuth, requireRole("admin", "support_agent"));
emailRouter.get("/emails", asyncHandler(listEmailsController));
emailRouter.get("/emails/:id", captureEmailViewActivity, asyncHandler(getEmail));
emailRouter.patch("/emails/:id", validateUpdateEmail, asyncHandler(patchEmail));
emailRouter.post("/triage-email", validateTriageRequest, asyncHandler(runTriage));
