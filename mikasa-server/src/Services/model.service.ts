import { google } from "@ai-sdk/google";

const providers = {
  google,
};

export type ProviderName = keyof typeof providers;

export function loadModel(modelName: string): any {
  const [providerName, ...modelParts] = modelName.split("/");
  const specificModel = modelParts.join("/");

  const provider = providers[providerName as ProviderName];

  if (!provider) {
    throw new Error(`Provider "${providerName}" not supported`);
  }

  if (providerName in providers) {
    return provider(specificModel);
  }

  throw new Error(`Model "${modelName}" not found`);
}
