import { ActivityLog } from "../models/activity-log.model.js";

export async function listActivityLogs(req, res) {
  const limit = Number.parseInt(req.query.limit ?? "100", 10);
  const safeLimit = Number.isNaN(limit) ? 100 : Math.min(Math.max(limit, 1), 500);

  const logs = await ActivityLog.find().sort({ happened_at: -1 }).limit(safeLimit);
  return res.json(logs);
}
