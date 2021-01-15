import { ServerRequest } from './server-request.model';
import { ServerResponse } from './server-response.model';

export interface ServerRoute {
    method: string;
    path: string;
    execute: (request: ServerRequest) => Promise<ServerResponse>;
}
