import express from "express";
import { postTransaction } from "../../Controllers/Generate/financier.js";
import { verifyApiKey } from "../../Middlewares/verifyUser.js";
import { upload } from "../../Middlewares/upload.js";
const router = express.Router();
router.post("/", verifyApiKey, postTransaction);
router.post("/upload", verifyApiKey, upload.single("ss"), postTransaction);
export default router;
