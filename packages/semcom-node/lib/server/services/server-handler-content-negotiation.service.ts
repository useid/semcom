import { LoggerService } from '@digita-ai/semcom-core';
import { ServerHandlerService } from './server-handler.service';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';
import serialize from 'rdf-serialize';

export class ServerHandlerContentNegotiationService extends ServerHandlerService {
    constructor(private logger: LoggerService) {
        super();
    }

    public async canHandle(request: ServerRequest, response: ServerResponse): Promise<boolean> {
        this.logger.log('debug', 'Checking content negotiation handler', { request, response });

        const contentTypes = await serialize.getContentTypes();

        const accept = request.headers['accept'];

        this.logger.log('debug', 'Checking supported content types', { contentTypes, accept, included: contentTypes.some(contentType => accept === contentType), accepted: accept === '*/*', canHandle: accept === '*/*' || contentTypes.some(contentType => accept === contentType) });

        return accept === '*/*' || contentTypes.some(contentType => accept === contentType);
    }

    public async handle(request: ServerRequest, response: ServerResponse): Promise<ServerResponse> {
        this.logger.log('debug', 'Running content negotiation handler', { request, response });

        return response;
    }
}
