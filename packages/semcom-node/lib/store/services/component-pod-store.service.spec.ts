import fetch from 'node-fetch';
import { Quad, DataFactory } from 'n3';
import { default as streamify } from 'streamify-array';
import serialize from 'rdf-serialize';
import { ComponentMetadata, LoggerConsoleService } from '@digita-ai/semcom-core';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { ComponentPodStore } from './component-pod-store.service';

const { namedNode, quad: createQuad } = DataFactory;

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

describe('ComponentPodStore', () => {

  const podUri = 'http://localhost:9000/metadata/';

  const quadTransformer: ComponentTransformerService = new ComponentTransformerService(new LoggerConsoleService());

  const componentPodStore = new ComponentPodStore(podUri, quadTransformer);

  let fetchMock: jest.MockedFunction<typeof fetch>;

  interface ComponentMetadataMock {
    component: ComponentMetadata;
    filename: string;
  }

  let componentInfoA: ComponentMetadataMock;
  let componentInfoB: ComponentMetadataMock;

  const streamToString = (stream: NodeJS.ReadableStream): Promise<string> => new Promise((resolve) => {

    const subStrings = [];
    stream.on('data', (chunk) => subStrings.push(chunk));
    stream.on('end', () => resolve(subStrings.join('')));

  });

  const mockComponents = (components: ComponentMetadataMock[]) => {

    fetchMock = (fetch as jest.MockedFunction<typeof fetch>);

    fetchMock.mockImplementation(async (url, options) => {

      if (options.method === undefined || options.method === 'get' // defaults to 'get'
       && options.headers?.['Accept'] === 'text/turtle') {

        if (url === podUri) {

          // ComponentPodStore is requesting all available components

          const quads: Quad[] = components.map((component) =>
            createQuad(namedNode(component.filename),
              namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
              namedNode('http://www.w3.org/ns/ldp#Resource')));

          const bodyStream = serialize.serialize(streamify(quads), { contentType: 'text/turtle' });
          const body = await streamToString(bodyStream);

          return new Response(body, { status: 200, headers: { 'Content-Type': 'text/turtle' } });

        } else {

          // ComponentPodStore is requesting the metadata of a pod

          const componentMock = components.find((component) => url === `${podUri}${component.filename}`);

          if (componentMock) {

            const quads: Quad[] = quadTransformer.toQuads([ componentMock.component ]);
            const bodyStream = serialize.serialize(streamify(quads), { contentType: 'text/turtle' });
            const body = await streamToString(bodyStream);

            return new Response(body, { status: 200, headers: { 'Content-Type': 'text/turtle' } });

          }

        }

      }

      return new Response('', { status: 501 });

    });

  };

  beforeEach(() => {

    jest.resetAllMocks();

    componentInfoA = {
      component: {
        uri: 'https://components.semcom.digita.ai/components/test.component.js',
        label: 'test component',
        description: 'abc',
        author: '',
        tag: 'test',
        version: '0.123',
        latest: true,
        shapes: [ 'http://digita.ai/voc/test#test' ],
      },
      filename: 'test1.ttl',
    };

    componentInfoB = {
      component: {
        uri: 'https://components.semcom.digita.ai/components/test2.component.js',
        label: 'test2',
        description: 'defg',
        author: '',
        tag: 'test2',
        version: '0.123',
        latest: true,
        shapes: [ 'http://digita.ai/voc/test#test2' ],
      },
      filename: 'test2.ttl',
    };

  });

  it('should be correctly instantiated', () => {

    expect(componentPodStore).toBeTruthy();

  });

  describe('all()', () => {

    it('works if there are no components', async () => {

      mockComponents([]);

      await expect(componentPodStore.all()).resolves.toEqual([]);

    });

    it('works if there is 1 component', async () => {

      mockComponents([ componentInfoA ]);

      await expect(componentPodStore.all()).resolves.toEqual([ componentInfoA.component ]);

    });

    it('works if there are multiple components', async () => {

      const componentInfos = [ componentInfoA, componentInfoB ];

      mockComponents(componentInfos);

      const resultComponents = await componentPodStore.all();

      expect(resultComponents.sort()).toEqual(componentInfos.map((info) => info.component).sort());

    });

    it('should only return components that are valid', async () => {

      componentInfoA.component.latest = 'not a boolean' as unknown as boolean; // obviously incorrect!

      mockComponents([ componentInfoA, componentInfoB ]);

      await expect(componentPodStore.all()).resolves.toEqual([ componentInfoB.component ]);

    });

  });

  describe('save()', () => {

    it('is not implemented', async () => {

      await expect(componentPodStore.save([])).rejects.toThrowError('Method not implemented.');

    });

  });

});
