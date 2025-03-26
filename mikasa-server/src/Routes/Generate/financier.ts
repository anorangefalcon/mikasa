import express from "express";
import { postTransaction } from "../../Controllers/Generate/financier.js";
import { verifyApiKey } from "../../Middlewares/verifyUser.js";

const router = express.Router();

router.post("/", postTransaction);

export default router;
