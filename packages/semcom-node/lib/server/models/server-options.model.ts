import { ServerController } from './server-controller.model';

export class ServerOptions {
    constructor(
        public controllers: ServerController[],
        public port?: number
    ) { }
}
