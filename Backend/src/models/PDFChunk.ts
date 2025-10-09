import mongoose from "mongoose";

const pdfChunkSchema = new mongoose.Schema({
  pdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pdf",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],  
    required: true,
  },
  chunkIndex: {
    type: Number,    
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PdfChunk = mongoose.model("PdfChunk", pdfChunkSchema);
export default PdfChunk;