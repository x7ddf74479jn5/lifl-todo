import { GoogleSpreadsheetRow } from "google-spreadsheet";

export interface TodoDataRow extends GoogleSpreadsheetRow {
  timestamp: string;
  am: string;
  pm: string;
  sleep: string;
  todo_date: string;
}

export const isDataRow = (rows: GoogleSpreadsheetRow[]): rows is TodoDataRow[] => {
  return true;
};
