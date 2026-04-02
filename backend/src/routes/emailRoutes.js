import { Router } from "express";
import { body, param } from "express-validator";
import { getEmailById, listEmails, patchEmail, triageEmail } from "../controllers/emailController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { CATEGORIES, PRIORITIES, TEAMS } from "../models/Email.js";

export const emailRouter = Router();

emailRouter.get("/emails", listEmails);

emailRouter.get(
  "/emails/:id",
  [param("id").isMongoId().withMessage("Email id must be a valid id."), validateRequest],
  getEmailById
);

emailRouter.patch(
  "/emails/:id",
  [
    param("id").isMongoId().withMessage("Email id must be a valid id."),
    body("category").optional().isIn(CATEGORIES),
    body("priority").optional().isIn(PRIORITIES),
    body("assigned_team").optional().isIn(TEAMS),
    body("summary").optional().isString().trim().isLength({ min: 1 }),
    body("suggested_reply").optional().isString().trim().isLength({ min: 1 }),
    body("confidence").optional().isFloat({ min: 0, max: 1 }),
    body("needs_human_review").optional().isBoolean(),
    body("reviewer_notes").optional().isString(),
    body("approved").optional().isBoolean(),
    validateRequest,
  ],
  patchEmail
);

emailRouter.post(
  "/triage-email",
  [
    body("id").isMongoId().withMessage("id must be a valid email id."),
    body("sender").isString().trim().isLength({ min: 1 }),
    body("subject").isString().trim().isLength({ min: 1 }),
    body("body").isString().trim().isLength({ min: 1 }),
    validateRequest,
  ],
  triageEmail
);
