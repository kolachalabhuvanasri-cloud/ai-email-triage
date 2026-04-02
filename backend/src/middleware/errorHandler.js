import { HttpError } from "../utils/httpError.js";

export function notFoundHandler(_req, res) {
  return res.status(404).json({ message: "Route not found." });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error." });
}
