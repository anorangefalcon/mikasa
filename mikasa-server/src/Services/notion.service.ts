import axios from "axios";
const API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

let _CACHE: {
  categories: { [key: string]: string };
  banks: { [key: string]: string };
} | null = null;

export async function updateExpenseTracker(options: any) {
  try {
    const { item, amount, category, bank } = options;
    const { categories, banks } = await getCategoriesAndBanksWithIds();

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
    const res = await axios.post(`${API_URL}/pages`, body, getHeaders());

    return res.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function getCategoriesAndBanksWithIds(): Promise<{
  categories: { [key: string]: string };
  banks: { [key: string]: string };
}> {
  if (_CACHE) return _CACHE;

  const res = await axios.get(
    `${API_URL}/databases/${process.env.NOTION_DB_ID}`,
    getHeaders()
  );

  const database = res.data;
  const categoriesDbId = database.properties.Category.relation.database_id;
  const banksDbId = database.properties.Bank.relation.database_id;

  const [categoriesRes, banksRes] = await Promise.all(
    [categoriesDbId, banksDbId].map(async (dbId) => {
      return axios.post(`${API_URL}/databases/${dbId}/query`, {}, getHeaders());
    })
  );
  const categories = mapNameToId(categoriesRes.data);
  const banks = mapNameToId(banksRes.data);

  _CACHE = { categories, banks };
  return { categories, banks };
}

function mapNameToId(data: any) {
  return data.results.reduce((acc: any, curr: any) => {
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
