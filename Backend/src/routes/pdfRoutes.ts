import express from "express";
import { pdfarr,uploadpdf,chatreply,deletechat,showhistory} from "../controller/pdfController.js";
const router = express.Router();

router.get("/pdfarr", pdfarr);
router.post("/uploadpdf", uploadpdf);
router.post("/chatreply", chatreply);
router.delete("/deletechat", deletechat);
router.get("/showhistory", showhistory);


export default router;
