import { generateText, Tool } from "ai";
import { getTool } from "../../Tools/index.js";
import { updateExpenseTracker } from "../../Services/notion.service.js";
import { loadModel } from "../../Services/model.service.js";
import { ai_model } from "../../../constants.js";

export async function postTransaction(req: any, res: any) {
  try {
    // const { query } = req.body;
    const { query } = req.query;
    if (!query) throw new Error("Text is required");

    const addTransactionTool: Tool = getTool(
      "useTransactionDetails",
      updateExpenseTracker
    );

    const prompt = `<System-Instructions> Your job is to analyze the user's text & extract the relevant transaction details just to update then via a tool. </System-Instructions> \n<User-Query-Data> ${query} </User-Query-Data>`;

    const model = loadModel(ai_model);
    if (!model) throw new Error("Model not supported");

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
