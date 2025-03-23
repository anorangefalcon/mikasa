var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createTransactionDetails } from "./financier.tools.js";
const TOOLS = {
    useTransactionDetails: createTransactionDetails,
};
export function getTool(name, executer, options) {
    const selectedTool = TOOLS[name] || null;
    if (!selectedTool)
        throw new Error(`Tool ${name} not found`);
    if (options) {
        const { description, parameters } = options;
        selectedTool.description = description;
        selectedTool.parameters = parameters;
    }
    selectedTool.execute = (_a) => __awaiter(this, void 0, void 0, function* () {
        var args = __rest(_a, []);
        return yield executer(args);
    });
    return selectedTool;
}
