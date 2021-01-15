import { ServerController } from './server-controller.model';
import { ServerHandlerService } from '../services/server-handler.service';

export class ServerOptions {
    constructor(
        public controllers: ServerController[],
        public handlers: ServerHandlerService[],
        public port?: number
    ) { }
}
