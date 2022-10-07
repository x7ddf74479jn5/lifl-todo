import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Message, WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";

import { runMiddleware } from "@/lib/next";
import * as line from "@/lib/line";
import { authWithCredentials, getSpreadSheet, getTodosData } from "@/lib/spreadsheet";

const doc = getSpreadSheet();

authWithCredentials(doc);

// スプレッドシートから本日のTodoを取得
async function handleEvent(event: WebhookEvent) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const data = await getTodosData(doc);
  console.log(data);

  let resMessage: Message[] = [];
  let todo = "";

  if (event.message.text == "午前中") {
    resMessage.push({
      type: "text",
      text: "午前中の予定は・・・",
    });
    data.forEach((d) => {
      if (d.am != "") {
        todo += d.am + "\n";
      }
    });
  } else if (event.message.text == "午後") {
    resMessage.push({
      type: "text",
      text: "午後の予定は・・・",
    });
    data.forEach((d) => {
      if (d.pm != "") {
        todo += d.pm + "\n";
      }
    });
  } else if (event.message.text == "寝る前") {
    resMessage.push({
      type: "text",
      text: "寝る前の予定は・・・",
    });
    data.forEach((d) => {
      if (d.sleep != "") {
        todo += d.sleep + "\n";
      }
    });
  } else {
    todo = "変なデータ送ってくるな";
  }

  todo = todo.trim();

  resMessage.push({
    type: "text",
    text: todo,
  });

  console.log(resMessage);

  return line.client.replyMessage(event.replyToken, resMessage);
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") return res.status(405).end();

    await runMiddleware(req, res, line.middleware);

    const body: WebhookRequestBody = req.body;
    await Promise.all(body.events.map(handleEvent)).then((result) => res.json(result));
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
