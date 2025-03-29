import { generateText, Tool } from "ai";
import { getTool } from "../../Tools/index.js";
import { updateExpenseTracker } from "../../Services/notion.service.js";
import { loadModel } from "../../Services/model.service.js";
import { ai_model } from "../../../constants/base.js";
import { getPrompt } from "../../../constants/prompts.js";
import { AuthenticatedRequest } from "../../Middlewares/verifyUser.js";
import { Response } from "express";
import fs from "fs/promises";

export async function postTransaction(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    let { query } = req.body;
    const { file } = req;
    if (!query && !file) throw new Error("Query or File is required");

    if (file) {
      query = await fs.readFile(file.path, "utf-8");
    }

    const addTransactionTool: Tool = getTool(
      "useTransactionDetails",
      updateExpenseTracker
    );

    const model = loadModel(ai_model);
    const prompt = getPrompt("financier", { query });
    if (!model || !prompt)
      throw new Error("Model not supported or Prompt not found");

    const { steps } = await generateText({
      model: model,
      prompt,
      tools: { addNewTransaction: addTransactionTool },
      toolChoice: { type: "tool", toolName: "addNewTransaction" },
      // maxSteps: 2,
    });

    const results = steps
      .flatMap((step) => step.toolResults)
      .map((res: any) => {
        return res?.result || "";
      });

    const combinedResult = results.join(" & ");

    res.status(200).json({
      success: true,
      results,
      message: combinedResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error, success: false });
  }
}
