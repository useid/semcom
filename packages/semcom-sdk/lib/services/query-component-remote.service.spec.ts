import { QueryComponentRemoteService } from './query-component-remote.service';

describe('QueryComponentRemoteService', () => {
  it('should be correctly instantiated', () => {
    const service = new QueryComponentRemoteService('test');

    expect(service).toBeTruthy();
  });

  it('should send get request to repository url', () => {
    const service = new QueryComponentRemoteService('test');

    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({}),
    }));
    window.fetch = mockFetch;

    service.query({});
    expect(fetch).toBeCalledWith('test/component/query', {
      body: '{}',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });
});
