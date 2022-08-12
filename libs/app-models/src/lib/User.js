import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
  },
  { timestamps: true }
);
UserSchema.index({ email: 1, phoneNumber: 1 });
export const UserModel = mongoose.model('User', UserSchema);
