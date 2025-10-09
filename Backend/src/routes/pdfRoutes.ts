import express from "express";
import { pdfarr,uploadpdf,chatreply,deletepdf,showhistory} from "../controller/pdfController.js";
const router = express.Router();
import multer from 'multer'
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/pdfarr", pdfarr);
router.post("/uploadpdf",upload.single('pdf'),uploadpdf);
router.post("/chatreply", chatreply);
router.post("/deletepdf", deletepdf);
router.get("/showhistory", showhistory);


export default router;
