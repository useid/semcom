import { MemoryStore } from '@digita-ai/handlersjs-core';
import fetch from 'node-fetch';
import { Quad, DataFactory } from 'n3';
import { default as streamify } from 'streamify-array';
import serialize from 'rdf-serialize';
import { PodSyncService } from './pod-sync.service';

const { namedNode, quad: createQuad } = DataFactory;

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

describe('PodSyncService', () => {

  const localPodUri = 'http://localhost:9000/metadata/';

  interface storeInterface {
    storage: string[];
  }

  let store: MemoryStore<storeInterface>;

  let podSyncService: PodSyncService<'storage', storeInterface>;

  let fetchMock: jest.MockedFunction<typeof fetch>;

  let localComponents: Set<string>;

  interface RemotePodMock {
    uri: string;
    components: ComponentMetadataMock[];
    isOnline: boolean;
    httpStatus: number;
  }

  interface ComponentMetadataMock {
    httpStatus: number;
    contents: string;
    filename: string;
  }

  const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<string> => new Promise((resolve) => {

    const bufs = [];
    stream.on('data', (chunk) => bufs.push(chunk));
    stream.on('end', () => resolve(bufs.join('')));

  });

  const mockPods = (localComponentFiles: string[], ... otherPods: RemotePodMock[]) => {

    store.set('storage', otherPods.map((pod) => pod.uri));

    localComponents = new Set(localComponentFiles);

    fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

    fetchMock.mockImplementation(async (url, options) => {

      if (options.method === undefined || options.method === 'get') { // defaults to 'get'

        const isRoot = url === localPodUri || otherPods.some((podMock) => podMock.uri === url && podMock.isOnline);

        if (isRoot) {

          // PodSyncService is requesting all available components in a pod

          let components = localComponentFiles;
          let httpStatusCode = 200;

          if (url !== localPodUri) {

            const pod = otherPods.find((podMock) => podMock.uri === url);
            components = pod.components.map((component) => component.filename);
            httpStatusCode = pod.httpStatus;

          }

          const quads: Quad[] = components.map((component) =>
            createQuad(namedNode(component),
              namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
              namedNode('http://www.w3.org/ns/ldp#Resource')));

          const bodyStream = serialize.serialize(streamify(quads), { contentType: 'text/turtle' });
          const body = await streamToBuffer(bodyStream);

          return new Response(body, { status: httpStatusCode, headers: { 'Content-Type': 'text/turtle' } });

        } else {

          // PodSyncService is requesting the metadata of a pod

          const metadata = otherPods
            .map((podMock) => podMock.components.find((component) => url === `${podMock.uri}${component.filename}`))
            .find((mock) => mock !== undefined);

          if (metadata) {

            return new Response(
              metadata.contents,
              { status: metadata.httpStatus, headers: { 'Content-Type': 'text/turtle' } }
            );

          } else {

            throw Error('pod is offline or non existent');

          }

        }

      } else if (options.method === 'post' && url === localPodUri
         && options.headers?.['Content-Type'] === 'text/turtle' && options.headers['Slug']) {

        // already tests if headers are correct

        localComponents.add(options.headers['Slug']);

        return new Response('', { status: 201 });

      } else {

        return new Response('', { status: 501 });

      }

    });

  };

  beforeEach(() => {

    localComponents = new Set();
    jest.resetAllMocks();

    store = new MemoryStore([ [ 'storage', [] ] ]);
    podSyncService = new PodSyncService('storage', store, localPodUri);

  });

  it('should be correctly instantiated', () => {

    expect(podSyncService).toBeTruthy();

  });

  describe('canHandle()', () => {

    it('should be true', async () => {

      await expect(podSyncService.canHandle().toPromise()).resolves.toBe(true);

    });

  });

  describe('handle()', () => {

    it('should always fetch its own pod', async () => {

      mockPods([]);

      await podSyncService.handle().toPromise();

      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(localPodUri);

    });

    it('fetches other pods', async () => {

      const otherPods = [
        {
          uri: 'test.com/',
          components: [],
          isOnline: true,
          httpStatus: 200,
        },
        {
          uri: 'test2.com/',
          components: [],
          isOnline: true,
          httpStatus: 200,
        },
      ];

      mockPods([], ... otherPods);

      await podSyncService.handle().toPromise();

      expect(fetchMock).toBeCalledTimes(3);

      const fetchedUris = fetchMock.mock.calls.map(([ url, options ]) => url);

      [ 'test.com/', 'test2.com/', localPodUri ].forEach((url) =>
        expect(fetchedUris).toContain(url));

    });

    it('adds fetched components in local pod', async () => {

      const otherPods = [
        {
          uri: 'test.com/',
          components: [ {
            httpStatus: 200,
            contents: '1',
            filename: 'metadata1.ttl',
          },
          {
            httpStatus: 200,
            contents: '2',
            filename: 'metadata2.ttl',
          } ],
          isOnline: true,
          httpStatus: 200,
        },
        {
          uri: 'test2.com/',
          components: [ {
            httpStatus: 200,
            contents: '3',
            filename: 'metadata3.ttl',
          } ],
          isOnline: true,
          httpStatus: 200,
        },
      ];

      mockPods([ 'localmetadata1.ttl' ], ... otherPods);

      await podSyncService.handle().toPromise();

      expect([ ... localComponents ].sort()).toEqual([
        'localmetadata1.ttl', 'metadata1.ttl', 'metadata2.ttl', 'metadata3.ttl',
      ]);

    });

    it("does not add component to local storage if http status wasn't 200", async () => {

      const otherPods = [
        {
          uri: 'test.com/',
          components: [ {
            httpStatus: 200,
            contents: '1',
            filename: 'metadata1.ttl',
          },
          {
            httpStatus: 404,
            contents: '2',
            filename: 'metadata2.ttl',
          } ],
          isOnline: true,
          httpStatus: 200,
        },
      ];

      mockPods([], ... otherPods);

      await podSyncService.handle().toPromise();

      expect([ ... localComponents ].sort()).toEqual([
        'metadata1.ttl',
      ]);

    });

    it("fetches only the components it doesn't have locally", async () => {

      const otherPods = [
        {
          uri: 'test.com/',
          components: [ {
            httpStatus: 200,
            contents: '1',
            filename: 'metadata1.ttl',
          },
          {
            httpStatus: 200,
            contents: '2',
            filename: 'metadata2.ttl',
          } ],
          isOnline: true,
          httpStatus: 200,
        },
      ];

      mockPods([ 'metadata1.ttl' ], ... otherPods);

      await podSyncService.handle().toPromise();

      const fetchedUris = fetchMock.mock.calls.map(([ url, options ]) => url);
      expect(fetchedUris).not.toContain('test.com/metadata1.ttl');
      expect(fetchedUris).toContain('test.com/metadata2.ttl');

    });

    it("doesn't throw any error if one of the remote pods is offline", async () => {

      const otherPods = [
        {
          uri: 'test.com/',
          components: [],
          isOnline: false,
          httpStatus: 200,
        },
      ];

      mockPods([], ... otherPods);

      // https://stackoverflow.com/questions/54525147/expect-a-jest-test-to-resolve-but-dont-care-about-the-value
      return podSyncService.handle().toPromise();

    });

    it("doesn't throw any error if one of the remote pods doesn't return status 200", async () => {

      const otherPods = [
        {
          uri: 'test.com/',
          components: [],
          isOnline: true,
          httpStatus: 500,
        },
      ];

      mockPods([], ... otherPods);

      return podSyncService.handle().toPromise();

    });

    it("doesn't throw any error if storage has no pods", async () => {

      mockPods([]);

      await store.delete('storage');

      return podSyncService.handle().toPromise();

    });

  });

});
