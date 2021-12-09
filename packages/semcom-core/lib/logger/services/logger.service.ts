/**
 * A logger service.
 */
export abstract class LoggerService {

   * Logs messages and an optional payload, depending on the severity level.
   *
   * @param { string } level - The log level (severity).
   * @param { string } message - The message to log.
   * @param { any } payload (optional) - The payload to attach to the log.
  public abstract log(level: string, message: string, payload?: any): void;

}
