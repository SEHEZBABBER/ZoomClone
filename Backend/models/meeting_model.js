import mongoose, { Schema } from "mongoose";
const meetingSchema = new Schema({
  user_id: { type: String },
  meetingCode: { type: String, required: true },
  date: { type: Data, required: true, default: Date.now() },
});
const meetingModel = mongoose.model("Meeting", meetingSchema);
export { meetingModel };
