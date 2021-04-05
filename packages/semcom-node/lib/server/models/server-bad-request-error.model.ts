import { ServerError } from './server-error.model';

export class ServerBadRequestError extends ServerError {
  public readonly name = ServerBadRequestError.name;

  constructor(message: string, cause?: Error) {
    super(message, cause);

    Object.setPrototypeOf(this, ServerBadRequestError.prototype);
  }
}
