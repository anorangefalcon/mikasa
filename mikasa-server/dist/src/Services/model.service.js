import { google } from "@ai-sdk/google";
const providers = {
    google,
};
export function loadModel(modelName) {
    const [providerName, ...modelParts] = modelName.split("/");
    const specificModel = modelParts.join("/");
    const provider = providers[providerName];
    if (!provider) {
        throw new Error(`Provider "${providerName}" not supported`);
    }
    if (providerName in providers) {
        return provider(specificModel);
    }
    throw new Error(`Model "${modelName}" not found`);
}
