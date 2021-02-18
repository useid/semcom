import { QueryComponentRemoteService } from './query-component-remote.service';

describe('QueryComponentRemoteService', () => {
  it('should be correctly instantiated', () => {
    const service = new QueryComponentRemoteService('test');

    expect(service).toBeTruthy();
  });

  it('should send get request to repository url', async () => {
    const service = new QueryComponentRemoteService('test');

    const mockFetch = jest.fn().mockImplementation(async () => {
      return { json: async () => ({}), ok: true };
    });
    window.fetch = mockFetch;
    service.query({});
    expect(fetch).toBeCalledWith('test/component/query', {
      body: '{}',
      headers: { Accept: 'application/json' },
      method: 'POST',
    });
  });
});
