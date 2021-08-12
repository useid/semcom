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

  const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<string> => new Promise((resolve) => {

    const bufs = [];
    stream.on('data', (chunk) => bufs.push(chunk));
    stream.on('end', () => resolve(bufs.join('')));

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
          const body = await streamToBuffer(bodyStream);

          return new Response(body, { status: 200, headers: { 'Content-Type': 'text/turtle' } });

        } else {

          // ComponentPodStore is requesting the metadata of a pod

          const componentMock = components.find((component) => url === `${podUri}${component.filename}`);

          if (componentMock) {

            const quads: Quad[] = quadTransformer.toQuads([ componentMock.component ]);
            const bodyStream = serialize.serialize(streamify(quads), { contentType: 'text/turtle' });
            const body = await streamToBuffer(bodyStream);

            return new Response(body, { status: 200, headers: { 'Content-Type': 'text/turtle' } });

          }

        }

      }

      return new Response('', { status: 501 });

    });

  };

  beforeEach(() => {

    jest.resetAllMocks();

  });

  it('should be correctly instantiated', () => {

    expect(componentPodStore).toBeTruthy();

  });

  describe('all()', () => {

    // todo implement

  });

  describe('save()', () => {

    it('is not implemented', async () => {

      await expect(componentPodStore.save([])).rejects.toThrowError('Method not implemented.');

    });

  });

});
