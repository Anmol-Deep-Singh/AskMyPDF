import express from 'express';
import mongoose from 'mongoose';
import {} from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';
import authRoutes from './routes/authRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import cors from "cors";
import { auth } from "./middleware/Auth.js";
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"], // Multiple possible frontend ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "x-requested-with"],
    optionsSuccessStatus: 200 // For legacy browser support
}));
app.use(express.json());
connectDB();
app.use("/api/auth", authRoutes);
app.use(auth);
app.use("/api/pdf", pdfRoutes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map