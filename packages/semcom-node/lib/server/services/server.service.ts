import { ServerOptions } from '../models/server-options.model';

export abstract class ServerService {
    abstract start(options: ServerOptions): Promise<void>;
}
