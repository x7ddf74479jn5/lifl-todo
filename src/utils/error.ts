export class HttpError extends Error {
  statusMessage = "";

  constructor() {
    super();
  }
}
