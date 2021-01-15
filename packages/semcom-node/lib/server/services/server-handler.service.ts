import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';

export abstract class ServerHandlerService {
    public abstract canHandle(request: ServerRequest, response: ServerResponse): Promise<boolean>;
    public abstract handle(request: ServerRequest, response: ServerResponse): Promise<ServerResponse>;
}
