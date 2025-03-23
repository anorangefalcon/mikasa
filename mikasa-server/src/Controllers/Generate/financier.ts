import { generateText, Tool } from "ai";
import { getTool } from "../../Tools/index.js";
import { updateExpenseTracker } from "../../Services/notion.service.js";
import { loadModel } from "../../Services/model.service.js";
import { ai_model } from "../../../constants/base.js";
import { getPrompt } from "../../../constants/prompts.js";

export async function postTransaction(req: any, res: any) {
  try {
    const { query } = req.body;
    if (!query) throw new Error("Query is required");

    const addTransactionTool: Tool = getTool(
      "useTransactionDetails",
      updateExpenseTracker
    );

    const model = loadModel(ai_model);
    const prompt = getPrompt("financier", { query });
    if (!model || !prompt)
      throw new Error("Model not supported or Prompt not found");

    const { text, steps } = await generateText({
      model: model,
      prompt,
      tools: { addNewTransaction: addTransactionTool },
      toolChoice: { type: "tool", toolName: "addNewTransaction" },
      // maxSteps: 2,
    });

    res.send({ message: text, steps, success: true });
    console.log(text, steps);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error, success: false });
  }
}
