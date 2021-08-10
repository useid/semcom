import { ComponentMetadata, LoggerConsoleService } from '@digita-ai/semcom-core';
import { DataFactory } from 'n3';
import { ComponentTransformerService } from './component-transformer.service';
const { namedNode, literal, quad } = DataFactory;

describe('ComponentTransformerService', () => {

  const componentMetaDatas: ComponentMetadata[] = [
    { uri: 'https://components.semcom.digita.ai/components/test.component.js',
      label: 'test component',
      description: 'abc',
      author: 'barack obama',
      tag: 'test',
      version: '0.123',
      latest: true,
      shapes: [ 'http://digita.ai/voc/test#test' ] },
    {
      uri: 'https://components.semcom.digita.ai/components/test2.component.js',
      label: 'test2 component',
      description: 'defg',
      author: 'donald trump',
      tag: 'test2',
      version: '0.124',
      latest: false,
      shapes: [ 'http://digita.ai/voc/test2#test2', 'http://digita.ai/voc/test3#test3' ],
    },
  ];

  let transformer: ComponentTransformerService = null;

  beforeEach(() => {

    transformer = new ComponentTransformerService(new LoggerConsoleService());

  });

  it('should be correctly instantiated', (() => {

    expect(transformer).toBeTruthy();

  }));

  describe('toQuads()', () => {

    it('transforms componentMetadata into a quad array', () => {

      const quads = transformer.toQuads(componentMetaDatas);

      componentMetaDatas.forEach((component) => {

        expect(quads).toContainEqual(quad(
          namedNode(component.uri),
          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          namedNode('http://semcom.digita.ai/voc#component'),
        ));

        // test the metadata keys with singular values
        const metaDataKeys: (keyof ComponentMetadata)[] = [ 'label', 'description', 'author', 'tag', 'version', 'latest' ];

        metaDataKeys.forEach((predicate) => {

          expect(quads).toContainEqual(
            quad(
              namedNode(component.uri),
              namedNode(`http://semcom.digita.ai/voc#${predicate}`),
              literal(component[predicate].toString())
            ),
          );

        });

        // test the shapes key, which contains a list of values
        component.shapes.forEach((shape) => {

          expect(quads).toContainEqual(
            quad(
              namedNode(component.uri),
              namedNode(`http://semcom.digita.ai/voc#shape`),
              namedNode(shape)
            )
          );

        });

      });

    });

    it('should return the right amount of quads', () => {

      const quads = transformer.toQuads(componentMetaDatas);

      expect(quads.length).toEqual(17);

    });

    it('should throw an error if components is undefined', () => {

      expect(() => transformer.toQuads(undefined)).toThrow('Argument components should be set.');

    });

    it('should return no quads when no components are given', () => {

      expect(transformer.toQuads([]).length).toEqual(0);

    });

  });

  describe('fromQuads()', () => {

    // not implemented yet

  });

});
