import { LoggerService } from '@digita-ai/semcom-core';
import { ServerHandlerService } from './server-handler.service';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';

export class ServerHandlerContentNegotiationService extends ServerHandlerService {
    constructor(private logger: LoggerService) {
        super();
    }

    public async canHandle(request: ServerRequest, response: ServerResponse): Promise<boolean> {
        this.logger.log('debug', 'Checking content negotiation handler', { request, response });

        return true;
    }

    public async handle(request: ServerRequest, response: ServerResponse): Promise<ServerResponse> {
        this.logger.log('debug', 'Running content negotiation handler', { request, response });

        return response;
    }
}
