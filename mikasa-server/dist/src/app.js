import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Router from "./Routes/index.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (_, res) => {
    res.send("Mikasa is live!");
});
app.use("/mikasa", Router);
export default app;
