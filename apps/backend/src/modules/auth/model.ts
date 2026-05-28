import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'manager', 'staff'] },
    refreshToken: { type: String },
  },
  { timestamps: true },
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
