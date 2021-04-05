export class ServerError extends Error {
  public readonly name = ServerError.name;

  constructor(messsage: string, public cause: Error) {
    super(messsage);

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
