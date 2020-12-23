import { LoggerService } from './logger.service';

export class LoggerConsoleService extends LoggerService {
    public log(level: string, message: string, payload?: any) {
        if (payload) {
            console.log(message, payload);
        } else {
            console.log(message);
        }
    }
}
