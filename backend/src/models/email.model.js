import mongoose from "mongoose";

const triageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["billing", "bug", "how_to", "feature_request", "other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      required: true,
    },
    assigned_team: {
      type: String,
      enum: ["support", "billing", "engineering"],
      required: true,
    },
    summary: { type: String, required: true, trim: true },
    suggested_reply: { type: String, required: true, trim: true },
    confidence: { type: Number, min: 0, max: 1, required: true },
    needs_human_review: { type: Boolean, required: true },
    reviewer_notes: { type: String, default: "" },
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
    body: { type: String, required: true },
    snippet: { type: String, required: true },
    received_at: { type: Date, required: true },
    status: { type: String, enum: ["new", "triaged", "reviewed"], required: true, default: "new" },
    triage: { type: triageSchema, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        if (ret.received_at instanceof Date) {
          ret.received_at = ret.received_at.toISOString();
        }
        if (ret.triage?.last_updated_at instanceof Date) {
          ret.triage.last_updated_at = ret.triage.last_updated_at.toISOString();
        }
        return ret;
      },
    },
  }
);

export const Email = mongoose.model("Email", emailSchema);
