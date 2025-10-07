import { type NextFunction,type Request,type Response } from 'express'
import userModel from '../models/User.js';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const pdfarr= async(req:Request , res:Response)=>{
    //@ts-ignore
    const user = req.user;
};
const uploadpdf= async(req:Request , res:Response)=>{};
const chatreply= async(req:Request , res:Response)=>{};
const deletechat= async(req:Request , res:Response)=>{};
const showhistory= async(req:Request , res:Response)=>{};

export {pdfarr,uploadpdf,chatreply,deletechat,showhistory}