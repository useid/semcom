import { QueryComponentRemoteService } from './query-component-remote.service';

describe('QueryComponentRemoteService', () => {
  it('should be correctly instantiated', () => {
    const service = new QueryComponentRemoteService('test');

    expect(service).toBeTruthy();
  });

  it('should send get request to repository url', () => {
    const service = new QueryComponentRemoteService('test');

    const mockFetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    });
    window.fetch = mockFetch;

    service.query({});
    expect(fetch).toBeCalledWith('test/component', {
      body: '{}',
      headers: { Accept: 'application/json' },
      method: 'GET',
    });
  });
});
