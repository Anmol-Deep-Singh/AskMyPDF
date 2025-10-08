import { type NextFunction,type Request,type Response } from 'express'
import userModel from '../models/User.js';
import pdfModel from '../models/PDF.js';
import historyModel from '../models/History.js';
import dotenv from 'dotenv';
import multer from 'multer'


const upload = multer({ dest: "uploads/" });

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const pdfarr= async(req:Request , res:Response)=>{
    try {
        //@ts-ignore
        const email = req.user.email;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json(
                {
                 message: "Incorrect validations",
                }
            );            
        }else{
            const id = user._id;
            const pdf = await pdfModel.find({user: id});
            res.status(200).json({
                pdflist:pdf
            })
        }
    } catch (error) {
        return res.status(400).json(
        {
            message: "Incorrect validations",
            error:error
        }
        );      
    }

};
const uploadpdf= async(req:Request , res:Response)=>{
    try {
        //@ts-ignore
        const email = req.user.email;
        const pdf = req.file;
        const user = await userModel.findOne({email});
            if(!user){
                return res.status(400).json({
                    message: "User not found",
                    error: "Invalid user"
                });            
        }
        if (!pdf) {
            return res.status(400).json({
                message: "No PDF file uploaded",
                error: "File is required"
            });
        }
        if (pdf.mimetype !== 'application/pdf') {
            return res.status(400).json({
                message: "Invalid file type",
                error: "Only PDF files are allowed"
            });
        }
        const newPDF = new pdfModel({
            filename: pdf.originalname,
            path: pdf.path,
            size: pdf.size,
            user: user._id
        });

        const savedPDF = await newPDF.save();
        
        res.status(200).json({
            message: "PDF uploaded successfully",
            data: {
                id: savedPDF._id,
                filename: savedPDF.filename,
                size: savedPDF.size
            },
            error: null
        });
        
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            message: "Upload failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
const chatreply= async(req:Request , res:Response)=>{};
const deletepdf= async(req:Request , res:Response)=>{
    try {
        //@ts-ignore
        const PDFid = req.body.PDFid;
        const delete_pdf = await pdfModel.deleteOne({_id: PDFid});
        const deleted_history = await historyModel.findOneAndDelete({pdf: PDFid});
        if(delete_pdf.deletedCount === 0){
            return res.status(400).json(
            {
                message: "Could not delete the PDF"
            }
            );            
        }else if(delete_pdf.deletedCount === 1){
            return res.status(200).json(
            {
                message: "PDF has been deleted",
                historyDeleted: deleted_history ? true : false,
            }
            );  
        }
    } catch (error) {
        return res.status(400).json(
        {
            message: "Incorrect validations",
            error:error
        }
        );      
    }    
};
const showhistory= async(req:Request , res:Response)=>{
    try {
        //@ts-ignore
        const PDFid = req.body.PDFid;
        const History = await historyModel.findOne({pdf: PDFid}).populate("pdf");
        if(!History){
            return res.status(400).json(
            {
                message: "Could not find the Pdf History"
            }
            );   
        }else{
            res.status(200).json({
                    History: History
            })
        }

    } catch (error) {
        return res.status(400).json(
        {
            message: "Incorrect validations",
            error:error
        }
        );         
    }
};

export {pdfarr,uploadpdf,chatreply,deletepdf,showhistory}