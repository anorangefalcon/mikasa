var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
let _CACHE = null;
export function updateExpenseTracker(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { item, amount, category, bank, date } = options;
            const { categories, banks } = yield getCategoriesAndBanksWithIds();
            const body = {
                parent: {
                    database_id: process.env.NOTION_DB_ID,
                },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: item,
                                },
                            },
                        ],
                    },
                    Date: {
                        date: {
                            start: date,
                        },
                    },
                    Amount: {
                        number: amount,
                    },
                    Category: {
                        relation: [
                            {
                                id: categories[category],
                            },
                        ],
                    },
                    Bank: {
                        relation: [
                            {
                                id: banks[bank],
                            },
                        ],
                    },
                },
            };
            const res = yield axios.post(`${API_URL}/pages`, body, getHeaders());
            return res.data;
        }
        catch (error) {
            console.error(error);
            return error;
        }
    });
}
function getCategoriesAndBanksWithIds() {
    return __awaiter(this, void 0, void 0, function* () {
        if (_CACHE)
            return _CACHE;
        const res = yield axios.get(`${API_URL}/databases/${process.env.NOTION_DB_ID}`, getHeaders());
        const database = res.data;
        const categoriesDbId = database.properties.Category.relation.database_id;
        const banksDbId = database.properties.Bank.relation.database_id;
        const [categoriesRes, banksRes] = yield Promise.all([categoriesDbId, banksDbId].map((dbId) => __awaiter(this, void 0, void 0, function* () {
            return axios.post(`${API_URL}/databases/${dbId}/query`, {}, getHeaders());
        })));
        const categories = mapNameToId(categoriesRes.data);
        const banks = mapNameToId(banksRes.data);
        _CACHE = { categories, banks };
        return { categories, banks };
    });
}
function mapNameToId(data) {
    return data.results.reduce((acc, curr) => {
        acc[curr.properties.Name.title[0].text.content] = curr.id;
        return acc;
    }, {});
}
function getHeaders() {
    return {
        headers: {
            Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": NOTION_VERSION,
        },
    };
}
