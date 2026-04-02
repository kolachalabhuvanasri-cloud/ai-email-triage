import { ActivityLog } from "../models/activity-log.model.js";

export async function logActivity({ userId, role, action, emailId = null, method, path }) {
  if (!userId || !role || !action) {
    return;
  }

  await ActivityLog.create({
    user_id: userId,
    role,
    action,
    email_id: emailId,
    method,
    path,
    happened_at: new Date(),
  });
}
