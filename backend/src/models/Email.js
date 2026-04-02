import mongoose from "mongoose";

const CATEGORIES = ["billing", "bug", "how_to", "feature_request", "other"];
const PRIORITIES = ["low", "medium", "high", "urgent"];
const TEAMS = ["support", "billing", "engineering"];
const STATUSES = ["new", "triaged", "reviewed"];

const triageSchema = new mongoose.Schema(
  {
    category: { type: String, enum: CATEGORIES, required: true },
    priority: { type: String, enum: PRIORITIES, required: true },
    assigned_team: { type: String, enum: TEAMS, required: true },
    summary: { type: String, required: true, trim: true },
    suggested_reply: { type: String, required: true, trim: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    needs_human_review: { type: Boolean, required: true, default: false },
    reviewer_notes: { type: String, default: "", trim: true },
    approved: { type: Boolean, default: false },
    last_updated_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const emailSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true, trim: true },
    customer_name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    snippet: { type: String, required: true, trim: true },
    received_at: { type: Date, required: true },
    status: { type: String, enum: STATUSES, default: "new", required: true },
    triage: { type: triageSchema, required: false },
  },
  { timestamps: true }
);

emailSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;

    if (ret.received_at) {
      ret.received_at = new Date(ret.received_at).toISOString();
    }

    if (ret.triage?.last_updated_at) {
      ret.triage.last_updated_at = new Date(ret.triage.last_updated_at).toISOString();
    }

    return ret;
  },
});

export const Email = mongoose.model("Email", emailSchema);
export { CATEGORIES, PRIORITIES, TEAMS, STATUSES };
