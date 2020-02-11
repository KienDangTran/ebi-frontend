export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);

    this.message = message;
    this.name = 'NotImplementedError';
  }
}

// tslint:disable-next-line: max-classes-per-file
export class HttpError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);

    this.message = message;
    this.status = status;
    this.name = 'HttpError';
  }
}
