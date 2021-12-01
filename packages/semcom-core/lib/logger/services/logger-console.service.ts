/* eslint-disable no-console -- is a logger */
import { LoggerService } from './logger.service';

/**
 * Class for logging console messages.
 */
export class LoggerConsoleService extends LoggerService {

  /**
   * Logs console messages.
   *
   * @param { string } level - The log level (severity).
   * @param { string } message - The message to log.
   * @param { any } payload (optional) - The payload to attach to the log.
   */
  log(level: string, message: string, payload?: any) {

    if (payload) {

      console.log(message, payload);

    } else {

      console.log(message);

    }

  }

}
