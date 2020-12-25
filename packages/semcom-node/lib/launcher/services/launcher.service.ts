import { LoggerService } from '@digita-ai/semcom-core';
import { ServerOptions } from '../../server/models/server-options.model';
import { ServerService } from '../../server/services/server.service';

export class LauncherService {
    constructor(private logger: LoggerService, private server: ServerService, private options: ServerOptions) { }

    public async launch(): Promise<void> {
        this.logger.log('debug', 'Launching application');

        this.server.start(this.options);
    }
}
