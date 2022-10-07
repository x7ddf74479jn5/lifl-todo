declare namespace NodeJS {
  interface ProcessEnv {
    readonly GOOGLE_APPLICATION_CREDENTIALS: string;
    readonly CHANNEL_ACCESS_TOKEN: string;
    readonly CHANNEL_SECRET: string;
    readonly SPREADSHEET_ID: string;
  }
}
