import { LoggerService } from '@digita-ai/semcom-core';
import { ServerOptions } from '../models/server-options.model';
import { ServerService } from './server.service';

export class ServerMockService extends ServerService {

    constructor(private logger: LoggerService) {
        super();
    }

    public async start(options: ServerOptions): Promise<void> {
        this.logger.log('debug', 'Starting server with options', options);
    }
}
