import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["admin", "support_agent"], required: true },
    action: { type: String, required: true, trim: true, index: true },
    email_id: { type: String, default: null, index: true },
    path: { type: String, required: true },
    method: { type: String, required: true },
    happened_at: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: false,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
