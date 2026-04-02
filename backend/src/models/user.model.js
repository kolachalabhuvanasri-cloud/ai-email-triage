import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "support_agent"], default: "support_agent", required: true },
    password_hash: { type: String },
    google_id: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password_hash;
        return ret;
      },
    },
  }
);

userSchema.path("password_hash").validate(function validatePasswordOrGoogle(value) {
  return Boolean(value || this.google_id);
}, "password_hash or google_id is required.");

export const User = mongoose.model("User", userSchema);
