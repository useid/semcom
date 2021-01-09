import { LoggerService } from './logger.service';

export class LoggerWinstonService extends LoggerService {
    public log(level: string, message: string, payload?: any) {
        throw new Error('Not implemented');
    }
}
