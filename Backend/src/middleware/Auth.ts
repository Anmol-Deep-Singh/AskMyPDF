import{ type NextFunction,type Request,type Response } from 'express'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { error } from 'console';


dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const auth = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const token = req.headers.token as string;
        if(!token){
            return res.status(400).json({
                message: "No token found"
            })
        }else{
            const decodeduser = jwt.verify(token,JWT_SECRET);
            //@ts-ignore
            req.user = decodeduser;
            next();
        }       
    } catch (err) {
        return res.status(400).json({
            message: "Invalid User",
            error: err
        })
    }
}
export {auth}