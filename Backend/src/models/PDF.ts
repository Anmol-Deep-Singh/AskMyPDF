import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },    
  uploadedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Pdf = mongoose.model("Pdf", pdfSchema);
export default Pdf;
