import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
  username: { type: String, requied: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.pre("save", async function (next) {
  this.password = bcrypt.hash(this.password, 10);
  next();
});
const userModel = mongoose.model("User", userSchema);
export { userModel };
