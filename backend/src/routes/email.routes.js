import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateTriageRequest, validateUpdateEmail } from "../middleware/validate.js";
import { getEmail, listEmailsController, patchEmail, runTriage } from "../controllers/email.controller.js";

export const emailRouter = Router();

emailRouter.get("/emails", asyncHandler(listEmailsController));
emailRouter.get("/emails/:id", asyncHandler(getEmail));
emailRouter.patch("/emails/:id", validateUpdateEmail, asyncHandler(patchEmail));
emailRouter.post("/triage-email", validateTriageRequest, asyncHandler(runTriage));
