const getFinancierPrompt = ({ query }) => {
    return `<System-Instructions> Your job is to analyze the user's text & extract the relevant transaction details just to update then via a tool. </System-Instructions> \n<User-Query-Data> ${query} </User-Query-Data>`;
};
export const getPrompt = (name, data) => {
    const promptMap = {
        financier: getFinancierPrompt,
    };
    if (!(name in promptMap))
        throw new Error("Invalid prompt name");
    const prompt = promptMap[name](data);
    if (!prompt)
        throw new Error("Empty prompt returned");
    return prompt;
};
