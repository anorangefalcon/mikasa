import express from "express";
import FinancierRouter from "./Generate/financier.js";
const router = express.Router();
router.use("/financier", FinancierRouter);
export default router;
