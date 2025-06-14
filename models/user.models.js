import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      min: 5,
      max: 50,
      lowercase: true,
      unique: true,
      match: [
        /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: "String",
      min: 6,
      required: [true, "Password is required"],
    },
    cartItems: { type: Object, default: {} },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
