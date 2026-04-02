import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    remember_me: { type: Boolean, default: false },
    expires_at: { type: Date, required: true, index: true },
    last_activity_at: { type: Date, required: true, default: Date.now },
    revoked_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

export const Session = mongoose.model("Session", sessionSchema);
