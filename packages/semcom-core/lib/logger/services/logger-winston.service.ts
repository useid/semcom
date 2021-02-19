import { Logger, createLogger, format, transports } from 'winston';
import { LoggerService } from './logger.service';

export class LoggerWinstonService extends LoggerService {

    public logger: Logger;

    constructor() {
        super();

        this.logger = createLogger({
            level: 'debug',
            format: format.combine(
                format.timestamp(),
                format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`)
            ),
            defaultMeta: { service: 'user-service' },
            transports: [
                new transports.Console(),
            ],
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public log(level: string, message: string, payload?: any): void {
        this.logger.log(level, `${message}`);
    }
}
