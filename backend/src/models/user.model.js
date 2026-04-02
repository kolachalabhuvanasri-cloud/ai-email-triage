import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password_hash: { type: String, required: true },
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

export const User = mongoose.model("User", userSchema);
