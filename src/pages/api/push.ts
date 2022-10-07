import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { Message } from "@line/bot-sdk";

import * as line from "@/lib/line";
import { authWithCredentials, getSpreadSheet, getTodosData } from "@/lib/spreadsheet";
import { HttpError } from "@/utils/error";

const doc = getSpreadSheet();

authWithCredentials(doc);

const main = async () => {
  const data = await getTodosData(doc);
  console.log(data);

  let resMessage: Message[] = [
    {
      type: "text",
      text: "今日の予定は・・・",
    },
  ];
  let todoAM = "午前の予定は・・・" + "\n";
  let todoPM = "午後の予定は・・・" + "\n";
  let todoSleep = "寝る前の予定は・・・" + "\n";

  data.forEach((d) => {
    if (d.am != "") {
      todoAM += d.am + "\n";
    }
    if (d.PM != "") {
      todoPM += d.PM + "\n";
    }
    if (d.sleep != "") {
      todoSleep += d.sleep + "\n";
    }
  });
  todoAM = todoAM.trim();
  todoPM = todoPM.trim();
  todoSleep = todoSleep.trim();

  resMessage.push(
    {
      type: "text",
      text: todoAM,
    },
    {
      type: "text",
      text: todoPM,
    },
    {
      type: "text",
      text: todoSleep,
    }
  );

  if (resMessage.length === 0) {
    resMessage = [
      {
        type: "text",
        text: "今日の予定はありません",
      },
    ];
  }
  console.log(resMessage);
  // 送信処理
  try {
    const res = await line.client.broadcast(resMessage);
    console.log(res);
  } catch (error) {
    if (error instanceof HttpError) {
      console.log(`エラー: ${error.statusMessage}`);
      // console.log(error.originalError.response.data);}
    }
  }
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    main();
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ name: e.name, message: e.message });
    } else {
      res.status(500).end();
    }
  }
};

export const config = {
  api: {
    bodyParser: false, // Necessary for line.middleware
  },
};

export default handler;
