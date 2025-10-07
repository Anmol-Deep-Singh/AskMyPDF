import express from 'express'
import mongoose from 'mongoose';
import  { type NextFunction,type Request,type Response } from 'express'
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';
import authRoutes from './routes/authRoutes.js'
import pdfRoutes from './routes/pdfRoutes.js'
import cors from "cors";
import  {auth}  from "./middleware/Auth.js";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
// connectDB();

app.use("/api/auth",authRoutes);
app.use(auth);
app.use("/api/pdf",pdfRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
