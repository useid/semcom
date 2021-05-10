/* eslint-disable no-console -- is a logger */
import { LoggerService } from './logger.service';

export class LoggerConsoleService extends LoggerService {

  log(level: string, message: string, payload?: any) {

    if (payload) {

      console.log(message, payload);

    } else {

      console.log(message);

    }

  }

}
