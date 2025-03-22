import { tool, Tool } from "ai";
import { createTransactionDetails } from "./financier.tools.js";

interface ToolOptions {
  description?: string;
  parameters?: Record<string, any>;
}

const TOOLS = {
  useTransactionDetails: createTransactionDetails,
};

export function getTool(
  name: keyof typeof TOOLS,
  executer: any,
  options?: ToolOptions
): Tool {
  const selectedTool: Tool = TOOLS[name] || null;

  if (!selectedTool) throw new Error(`Tool ${name} not found`);

  if (options) {
    const { description, parameters } = options;
    selectedTool.description = description;
    selectedTool.parameters = parameters;
  }

  selectedTool.execute = async ({ ...args }) => {
    return await executer(args);
  };

  return selectedTool;
}
