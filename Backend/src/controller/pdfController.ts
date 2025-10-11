import { type NextFunction,type Request,type Response } from 'express'
import userModel from '../models/User.js';
import pdfModel from '../models/PDF.js';
import historyModel from '../models/History.js';
import { pdf as pdfParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsFromChunks,getQueryEmbedding } from '../util/Embedder.js';
import PdfChunk from '../models/PDFChunk.js';
import { AskGemini } from '../util/geminiHelper.js';
import mongoose from 'mongoose';
async function chunkPdfText(pdfText: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,   
    chunkOverlap: 200, 
  });

  const chunks = await splitter.splitText(pdfText);
  return chunks;
}
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
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
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
            size: pdf.size,
            user: user._id
        });
        const savedPDF = await newPDF.save();
        const parsed = await pdfParse(req.file.buffer);
        const chunks = await chunkPdfText(parsed.text);
        const vectors = await getEmbeddingsFromChunks(chunks);
        let docs:any = [];
        for(let i = 0; i<chunks.length ; i++){
            docs.push({
                pdf:savedPDF._id,
                content:chunks[i],
                embedding:vectors[i],
                chunkIndex:i,
            })
        }
        await PdfChunk.insertMany(docs);
        res.status(200).json({
            message: "PDF uploaded successfully",
            data: {
                id: savedPDF._id,
                filename: savedPDF.filename,
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
const chatreply= async(req:Request , res:Response)=>{
    try {
        const query = (req.body?.query as string);
        if(!query){
            return res.status(400).json({ message: "Query could not be processed" });
        }
        const PDFid = req.body?.PDFid as string;
        if (!PDFid) {
            return res.status(400).json({ message: "PDFid is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(PDFid)) {
            return res.status(400).json({ message: "Invalid PDFid" });
        }
        const PDF = await pdfModel.findOne({_id: new mongoose.Types.ObjectId(PDFid)});
        if(!PDF){
            return res.status(400).json({ message: "PDF could not be find" });
        }
        const queryEmb = await getQueryEmbedding(query);
        const results = await PdfChunk.aggregate([
        {
            "$vectorSearch": {
            "index": "vector_index",
            "path": "embedding",
            "queryVector": queryEmb,
            "numCandidates": 100,
            "limit": 2,
            }
        }
        ])
        const context = results.map(r => r.content).join("\n\n");
        const prompt = `
            You are a helpful assistant. Use the following PDF content to answer the user's question.
            PDF Content:
            ${context}
            User's Question:
            ${query}
            Answer in a clear, concise way, and mention page numbers if relevant.
            `;
        const answer = await AskGemini(prompt);
        console.log(`This is the answer ${answer}`)
        const history = await historyModel.findOneAndUpdate({pdf:PDF._id},{
            $push: {
                conversations:{
                    userPrompt:query,
                    apiResponse:answer,
                }
            }},{ new: true, upsert: true } );
        res.status(200).json({
            data: answer
        })
    } catch (err) {
        res.status(500).json({
            message: "Chat failed",
            error: err instanceof Error ? err.message : "Unknown error"
        });        
    }
};
const deletepdf= async(req:Request , res:Response)=>{
    try {
        //@ts-ignore
        const PDFid = req.body.PDFid;
        const delete_pdf = await pdfModel.deleteOne({_id: PDFid});
        console.log(delete_pdf);
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
        const History = await historyModel.findOne({pdf: PDFid});
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