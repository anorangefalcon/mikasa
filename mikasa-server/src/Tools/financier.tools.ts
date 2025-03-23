import { Tool } from "ai";
import { z } from "zod";
import { categories, bankAccounts } from "../../constants/base.js";

export const createTransactionDetails: Tool = {
  description:
    "Use this tool to form transaction details and update them to Notion database.",
  parameters: z.object({
    item: z.string().nonempty().describe("Name of the purchased item"),
    amount: z.number().positive().describe("Amount of the purchased item"),
    category: z.enum(categories).describe("Category of the purchased item"),
    bank: z
      .enum(bankAccounts)
      .describe("Bank account used for the transaction"),
  }),
};
