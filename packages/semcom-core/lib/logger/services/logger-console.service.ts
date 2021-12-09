/* eslint-disable no-console -- is a logger */
import { LoggerService } from './logger.service';

/**
 * A { LoggerService } for logging console messages.
 */
export class LoggerConsoleService extends LoggerService {

  /**
   * { @inheritDoc LoggerService }
   */
  log(level: string, message: string, payload?: any) {

    if (payload) {

      console.log(message, payload);

    } else {

      console.log(message);

    }

  }

}
