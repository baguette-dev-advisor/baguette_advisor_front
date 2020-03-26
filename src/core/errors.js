class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export class HttpError extends ExtendableError {
  constructor(code, body, ...params) {
    super('HttpError ' + code + ': ' + JSON.stringify(body), ...params);

    this.name = 'HttpError';
    this.code = code;
    this.body = body;
  }
}
