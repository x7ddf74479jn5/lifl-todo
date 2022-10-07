import { TodoDataRow, isDataRow } from "@/models/todo";
import { GoogleSpreadsheet } from "google-spreadsheet";

const creds = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, "base64").toString());

export const getSpreadSheet = () => new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

export const authWithCredentials = (doc: GoogleSpreadsheet) => doc.useServiceAccountAuth(creds);

// スプレッドシートから本日のTodoを取得
export async function getTodosData(doc: GoogleSpreadsheet): Promise<TodoDataRow[]> {
  await doc.loadInfo();
  console.log(doc.title);
  const sheet = doc.sheetsByIndex[0];
  doc.sheetsByTitle[doc.title];
  console.log(sheet);
  const rows = await sheet.getRows();

  if (!isDataRow(rows)) throw new Error("スプレッドシートのデータ形式が違います");
  // 現在時刻を取得 TODO: このコードではUTC時間になっているので、日本時間-9時間となっています。
  const today = new Date();
  // 本日の日時とTodoから取得した日時を比較して、本日の日時のTodoデータだけ取り出す
  const resData = rows.filter((item) => {
    const saveTime = new Date(item.todo_date);
    if (
      saveTime.getFullYear() === today.getFullYear() &&
      saveTime.getMonth() === today.getMonth() &&
      saveTime.getDate() === today.getDate()
    ) {
      console.log(item.todo_date);
      console.log(saveTime.getDate());
      console.log(today.getDate());
      return true;
    }
    return false;
  });
  console.log(resData);

  return resData;
}
