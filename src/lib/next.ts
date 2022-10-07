import { NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "@line/bot-sdk/lib/middleware";

export async function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Middleware) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}
