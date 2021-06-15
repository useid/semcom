import { QueryComponentRemoteService } from './query-component-remote.service';

describe('QueryComponentRemoteService', () => {

  it('should be correctly instantiated', () => {

    const service = new QueryComponentRemoteService('test');

    expect(service).toBeTruthy();

  });

  it('should send get request to repository url', async () => {

    const service = new QueryComponentRemoteService('test');

    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
    }));

    window.fetch = mockFetch;

    await service.query({});

    expect(fetch).toBeCalledWith('test/component/query', {
      body: '{}',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

  });

  it('should throw error when request fails', async () => {

    const service = new QueryComponentRemoteService('test');

    const mockFetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve({}),
      ok: false,
    }));

    window.fetch = mockFetch;

    await expect(service.query({})).rejects.toThrow();

  });

  it('should throw error when querying if filter is not set', async () => {

    const service = new QueryComponentRemoteService('test');

    await expect(service.query(null)).rejects.toThrow();

  });

  it('should throw error when querying if repository is not set', async () => {

    const service = new QueryComponentRemoteService(null);

    await expect(service.query({})).rejects.toThrow();

  });

});
