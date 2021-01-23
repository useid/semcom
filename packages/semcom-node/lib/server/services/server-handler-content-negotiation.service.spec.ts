import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { LoggerConsoleService } from '@digita-ai/semcom-core';
import { QuadSerializationService } from '../../quad/services/quad-serialization.service';
import { ServerHandlerContentNegotiationService } from './server-handler-content-negotiation.service';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';

const logger = new LoggerConsoleService();

describe('ServerHandlerContentNegotiationService', () => {
  it('should be correctly instantiated', () => {
    const server = new ServerHandlerContentNegotiationService(
      logger,
      'application/ld+json',
      new ComponentTransformerService(logger), 
      new QuadSerializationService(logger)
    );

    expect(server).toBeTruthy();
  });

  it('should not support accept */*', async () => {
    const server = new ServerHandlerContentNegotiationService(
      logger,
      'application/ld+json',
      new ComponentTransformerService(logger), 
      new QuadSerializationService(logger)
    );
    const request: ServerRequest = { method: 'GET', headers: { accept: '*/*' } };
    const response: ServerResponse = {
      status: 200,
      body: 'foo',
      headers: { 'content-type': 'application/json' },
    };
    const canHandle = await server.canHandle(request, response);

    expect(canHandle).toBe(false);
  });

  it('should support accept text/turtle', async () => {
    const server = new ServerHandlerContentNegotiationService(
      logger,
      'application/ld+json',
      new ComponentTransformerService(logger), 
      new QuadSerializationService(logger)
    );
    const request: ServerRequest = {
      method: 'GET',
      headers: { accept: 'text/turtle' },
    };
    const response: ServerResponse = {
      status: 200,
      body: 'foo',
      headers: { 'content-type': 'application/json' },
    };
    const canHandle = await server.canHandle(request, response);

    expect(canHandle).toBe(true);
  });

  it('should support accept unknown content types', async () => {
    const server = new ServerHandlerContentNegotiationService(
      logger,
      'application/ld+json',
      new ComponentTransformerService(logger), 
      new QuadSerializationService(logger)
    );
    const request: ServerRequest = {
      method: 'GET',
      headers: { accept: 'foo/bar' },
    };
    const response: ServerResponse = {
      status: 200,
      body: 'foo',
      headers: { 'content-type': 'application/json' },
    };
    const canHandle = await server.canHandle(request, response);

    expect(canHandle).toBe(true);
  });
});
