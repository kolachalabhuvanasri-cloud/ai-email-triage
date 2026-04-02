import { logActivity } from "../services/activity-log.service.js";

export function captureEmailViewActivity(req, _res, next) {
  req.onEmailViewed = async () => {
    await logActivity({
      userId: req.user?.sub,
      role: req.user?.role,
      action: "email.view",
      emailId: req.params.id,
      method: req.method,
      path: req.originalUrl,
    });
  };

  next();
}
