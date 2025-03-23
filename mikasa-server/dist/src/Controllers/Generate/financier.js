var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateText } from "ai";
import { getTool } from "../../Tools/index.js";
import { updateExpenseTracker } from "../../Services/notion.service.js";
import { loadModel } from "../../Services/model.service.js";
import { ai_model } from "../../../constants/base.js";
import { getPrompt } from "../../../constants/prompts.js";
export function postTransaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { query } = req.body;
            if (!query)
                throw new Error("Query is required");
            const addTransactionTool = getTool("useTransactionDetails", updateExpenseTracker);
            const model = loadModel(ai_model);
            const prompt = getPrompt("financier", { query });
            if (!model || !prompt)
                throw new Error("Model not supported or Prompt not found");
            const { text, steps } = yield generateText({
                model: model,
                prompt,
                tools: { addNewTransaction: addTransactionTool },
                toolChoice: { type: "tool", toolName: "addNewTransaction" },
                // maxSteps: 2,
            });
            res.status(200).json({
                message: text,
                success: true,
                toolResult: (_a = steps[0]) === null || _a === void 0 ? void 0 : _a.toolResults,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error, success: false });
        }
    });
}
