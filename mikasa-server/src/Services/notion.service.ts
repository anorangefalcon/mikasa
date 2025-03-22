import axios from "axios";
const API_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

export async function updateExpenseTracker(options: any) {
  try {
    const { item, amount, category, bank } = options;
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
            start: new Date().toISOString(),
          },
        },
        Amount: {
          number: amount,
        },
        //   "Category": {
        //     "relation": [{
        //       "id": "selected_category_id"}]},
        //    "Bank": {
        //     "relation":[{
        //      "id": "selected_bank_id"}]}
      },
    };
    const res = await axios.post(`${API_URL}`, body, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
