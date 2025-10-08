import express from "express";
import { pdfarr,uploadpdf,chatreply,deletepdf,showhistory} from "../controller/pdfController.js";
const router = express.Router();
import multer from 'multer'
const upload = multer({ dest: "uploads/" });

router.get("/pdfarr", pdfarr);
router.post("/uploadpdf",upload.single('pdf'),uploadpdf);
router.post("/chatreply", chatreply);
router.delete("/deletechat", deletepdf);
router.get("/showhistory", showhistory);


export default router;
