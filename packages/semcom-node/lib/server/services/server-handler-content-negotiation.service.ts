import { Component, LoggerService } from '@digita-ai/semcom-core';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { QuadSerializationService } from '../../quad/services/quad-serialization.service';
import { ServerHandlerService } from './server-handler.service';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';
import serialize from 'rdf-serialize';

export class ServerHandlerContentNegotiationService extends ServerHandlerService {
  constructor(
    private logger: LoggerService,
    private defaultContentType: string,
    private transformer: ComponentTransformerService,
    private serializer: QuadSerializationService,
  ) {
    super();
  }

  public async canHandle(
    request: ServerRequest,
    response: ServerResponse,
  ): Promise<boolean> {
    this.logger.log('debug', 'Checking content negotiation handler', {
      request,
      response,
    });

    const contentType = request.headers['accept'];

    return contentType !== 'application/json' && contentType !== '*/*';
  }

  public async handle(
    request: ServerRequest,
    response: ServerResponse,
  ): Promise<ServerResponse> {
    let res: ServerResponse = { ...response, status: 406, body: null };

    this.logger.log('debug', 'Running content negotiation handler', {
      request,
      response,
    });

    const contentType = request.headers['accept'];

    const isContentTypeSupported = await this.isContentTypeSupported(
      contentType,
    );

    if (isContentTypeSupported) {
      const components: Component[] = response.body;

      const quads = this.transformer.toQuads(components);

      const contentType =
        request.headers['accept'] === '*/*'
          ? this.defaultContentType
          : request.headers['accept'];

      const resultStream = this.serializer.serialize(quads, contentType);

      this.logger.log('debug', 'Mapped to rdf', { request, response });

      res = {
        ...response,
        body: resultStream,
        headers: { ...response.headers, 'content-type': contentType },
      };
    }

    return res;
  }

  private async isContentTypeSupported(contentType: string): Promise<boolean> {
    const contentTypes = await serialize.getContentTypes();

    this.logger.log('debug', 'Checking supported content types', {
      contentTypes,
      contentType,
    });

    return contentTypes.some((c) => c === contentType);
  }
}
