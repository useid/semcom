import { HttpError, HttpHandlerContext, HttpHandlerResponse } from '@digita-ai/handlersjs-http';
import { LoggerConsoleService } from '@digita-ai/semcom-core';
import { of } from 'rxjs';
import { ComponentTransformerService } from '../component/services/component-transformer.service';
import { ContentNegotiationHttpHandler } from '../handlers/content-negotiation.handler';
import { QuadSerializationService } from '../quad/services/quad-serialization.service';
import { ComponentHttpHandler } from './component.handler';

const logger = new LoggerConsoleService();

describe('ServerHandlerContentNegotiationService', () => {

  let contentHandler: ComponentHttpHandler;
  let handler: ContentNegotiationHttpHandler;
  let mockCTX: HttpHandlerContext;
  let mockResponse: HttpHandlerResponse;

  beforeEach(() => {

    contentHandler = ({
      handle: () => of({
        body: null,
        headers: {},
        status: 200,
      }),
    }) as unknown as ComponentHttpHandler;

    handler = new ContentNegotiationHttpHandler(
      contentHandler,
      logger,
      'application/ld+json',
      new ComponentTransformerService(logger),
      new QuadSerializationService(logger),
    );

    mockCTX = {
      request: {
        headers: {
          accept: '*/*',
        },
        url: new URL('http://example.com'),
        method: 'GET',
      },
    };

    mockResponse = {
      body: null,
      headers: {},
      status: 200,
    };

  });

  it('should be correctly instantiated', () => {

    expect(handler).toBeTruthy();

  });

  describe('canhandle()', () => {

    it('should return true when accept header = */*', async() => {

      mockCTX.request.headers.accept = '*/*';
      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toBe(true);

    });

    it('should return true when accept header = text/turtle', async() => {

      mockCTX.request.headers.accept = 'text/turtle';
      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toBe(true);

    });

    it('should return false when accept header = application/json', async() => {

      mockCTX.request.headers.accept = 'application/json';
      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toBe(false);

    });

  });

  describe('handle()', () => {

    it('throws when context.request is null', async() => {

      await expect(handler.handle({ ...mockCTX, request: null }).toPromise()).rejects.toThrow(
        'Argument request should be set.',
      );

    });

    it('throws when response is null', async() => {

      contentHandler.handle = () => of(null);

      await expect(handler.handle(mockCTX).toPromise()).rejects.toThrow(
        'Argument response should be set.',
      );

    });

    it('should return 406 for unknown content types', async() => {

      mockCTX.request.headers.accept = 'unsupportedContentType';
      await expect(handler.handle(mockCTX).toPromise()).rejects.toThrowError(new HttpError(406, 'Not acceptable'));

    });

  });

});
