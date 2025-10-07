import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  pdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDF",
    required: true,
  },
  conversations: [
    {
      userPrompt: { type: String, required: true },
      apiResponse: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

const History = mongoose.model("History", historySchema);
export default History;
