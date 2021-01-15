import * as quad from 'rdf-quad';
import * as streamify from 'streamify-array';
import { Component, LoggerService } from '@digita-ai/semcom-core';
import { ServerHandlerService } from './server-handler.service';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';
import serialize from 'rdf-serialize';

export class ServerHandlerContentNegotiationService extends ServerHandlerService {
  constructor(
    private logger: LoggerService,
    private defaultContentType: string,
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

    const contentTypes = await serialize.getContentTypes();

    const accept = request.headers['accept'];

    this.logger.log('debug', 'Checking supported content types', {
      contentTypes,
      accept,
      included: contentTypes.some((contentType) => accept === contentType),
      accepted: accept === '*/*',
      canHandle:
        accept === '*/*' ||
        contentTypes.some((contentType) => accept === contentType),
    });

    return (
      (accept === '*/*' ||
        contentTypes.some((contentType) => accept === contentType)) &&
      response.headers['content-type'] === 'application/json'
    );
  }

  public async handle(
    request: ServerRequest,
    response: ServerResponse,
  ): Promise<ServerResponse> {
    this.logger.log('debug', 'Running content negotiation handler', {
      request,
      response,
    });

    const components: Component[] = response.body;

    const quads = components
      .map((component) => [
        quad(
          `https://node.semcom.digita.ai/c/${component.uri}`,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          'http://semcom.digita.ai/voc#component',
        ),
        quad(
          `https://node.semcom.digita.ai/c/${component.uri}`,
          'http://semcom.digita.ai/voc#label',
          component.label,
        ),
      ])
      .reduce((acc, val) => acc.concat(val), []);

    const parseStream = streamify(quads);

    const contentType =
      request.headers['accept'] === '*/*'
        ? this.defaultContentType
        : request.headers['accept'];

    const resultStream = serialize.serialize(parseStream, { contentType });

    this.logger.log('debug', 'Mapped to rdf', { request, response });

    return {
      ...response,
      body: resultStream,
      headers: { ...response.headers, 'content-type': contentType },
    };

    return null;
  }
}
