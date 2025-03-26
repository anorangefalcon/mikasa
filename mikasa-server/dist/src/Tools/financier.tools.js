import { z } from "zod";
import { categories, bankAccounts } from "../../constants/base.js";
export const createTransactionDetails = {
    description: "Use this tool to form transaction details and update them to Notion database.",
    parameters: z.object({
        item: z
            .string()
            .nonempty()
            .describe("Name of the purchased item, try to capitalize"),
        amount: z.number().positive().describe("Amount of the purchased item"),
        category: z.enum(categories).describe("Category of the purchased item"),
        bank: z
            .enum(bankAccounts)
            .describe("Bank account used for the transaction, default use BOB")
            .default("BOB"),
        date: z
            .string()
            .describe(`Date of the transaction (if provided by the user), date should be in ISO string format. Current/Default date is ${new Date().toISOString()}`)
            .default(new Date().toISOString()),
    }),
};
