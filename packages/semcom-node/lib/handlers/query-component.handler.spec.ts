import { HttpHandlerContext, HttpHandlerResponse } from '@digita-ai/handlersjs-http';
import { LoggerConsoleService } from '@digita-ai/semcom-core';
import { ComponentService } from '../component/services/component.service';
import { ManageComponentStoreService } from '../component/services/manage-component-store.service';
import { QueryComponentStoreService } from '../component/services/query-component-store.service';
import { initialComponents } from '../mock/initial-components';
import { ComponentInMemoryStore } from '../store/services/component-in-memory-store.service';
import { QueryComponentHttpHandler } from './query-component.handler';

describe('QueryComponentHttpHandler', () => {

  let handler: QueryComponentHttpHandler;
  let mockCTX: HttpHandlerContext;
  let mockResponse: HttpHandlerResponse;

  beforeEach(() => {

    const store = new ComponentInMemoryStore(initialComponents);

    handler = new QueryComponentHttpHandler(
      new ComponentService(
        new QueryComponentStoreService(store),
        new ManageComponentStoreService(store),
        new LoggerConsoleService(),
      ),
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

  describe('handle()', () => {

    it('should error when body is undefined', async () => {

      await expect(handler.handle(mockCTX).toPromise()).rejects.toThrow('body of the request should be set.');

    });

    it('should error when body is invalid json', async () => {

      mockCTX.request.body = '{ test: }';

      await expect(handler.handle(mockCTX).toPromise()).rejects.toThrow('error while parsing request body.');

    });

  });

  describe('canHandle()', () => {

    it('should return false when method is not POST', async () => {

      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toEqual(false);

    });

    it('should return true when method is POST', async () => {

      mockCTX.request.method = 'POST';

      await expect(handler.canHandle(mockCTX).toPromise()).resolves.toEqual(true);

    });

  });

});
