import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validateAuth } from "../middleware/validate.js";
import { login, me, signup } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/auth/signup", validateAuth, asyncHandler(signup));
authRouter.post("/auth/login", validateAuth, asyncHandler(login));
authRouter.get("/auth/me", requireAuth, asyncHandler(me));
