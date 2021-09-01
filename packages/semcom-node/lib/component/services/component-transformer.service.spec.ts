import { ComponentMetadata, LoggerConsoleService } from '@digita-ai/semcom-core';
import { DataFactory, Quad } from 'n3';
import { ComponentTransformerService } from './component-transformer.service';

const { namedNode, literal, quad: createQuad } = DataFactory;

describe('ComponentTransformerService', () => {

  const digitaPrefix = 'http://semcom.digita.ai/voc#';

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

  // use to test fromQuadsOne
  let quadsTest1: Quad[];

  // use to test fromQuads
  let quadsAll: Quad[];

  let transformer: ComponentTransformerService = null;

  beforeEach(() => {

    transformer = new ComponentTransformerService(new LoggerConsoleService());
    quadsTest1 = transformer.toQuads([ componentMetaDatas[0] ]);
    quadsAll = transformer.toQuads(componentMetaDatas);

  });

  it('should be correctly instantiated', (() => {

    expect(transformer).toBeTruthy();

  }));

  describe('toQuads()', () => {

    it('transforms componentMetadata into a quad array', () => {

      const quads = transformer.toQuads(componentMetaDatas);

      componentMetaDatas.forEach((component) => {

        expect(quads).toContainEqual(createQuad(
          namedNode(component.uri),
          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          namedNode('http://semcom.digita.ai/voc#component'),
        ));

        // test the metadata keys with singular values
        const metaDataKeys: (keyof ComponentMetadata)[] = [ 'label', 'description', 'author', 'tag', 'version', 'latest' ];

        metaDataKeys.forEach((predicate) => {

          expect(quads).toContainEqual(
            createQuad(
              namedNode(component.uri),
              namedNode(`http://semcom.digita.ai/voc#${predicate}`),
              literal(component[predicate].toString())
            ),
          );

        });

        // test the shapes key, which contains a list of values
        component.shapes.forEach((shape) => {

          expect(quads).toContainEqual(
            createQuad(
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

  describe('fromQuadsOne()', () => {

    it('should throw an error if 1 required predicate is not found', () => {

      const quads = quadsTest1.filter((quad) => quad.predicate.value !== `${digitaPrefix}label`);
      expect(() => transformer.fromQuadsOne(quads, componentMetaDatas[0].uri)).toThrow('Some ComponentMetadata predicates were missing while parsing quads.');

    });

    it('should throw an error if more than 1 required predicates are not found', () => {

      const quads = quadsTest1.filter((quad) =>
        quad.predicate.value !== `${digitaPrefix}label` && quad.predicate.value !== `${digitaPrefix}version`);

      expect(() => transformer.fromQuadsOne(quads, componentMetaDatas[0].uri)).toThrow('Some ComponentMetadata predicates were missing while parsing quads.');

    });

    it('should throw an error if too many predicates are found', () => {

      quadsTest1.push(createQuad(namedNode(componentMetaDatas[0].uri), namedNode(`${digitaPrefix}label`), literal('test')));

      expect(() => transformer.fromQuadsOne(quadsTest1, componentMetaDatas[0].uri)).toThrow('Too many ComponentMetadata predicates were provided while parsing quads.');

    });

    it('should not throw an error if multiple shapes are found', () => {

      quadsTest1.push(createQuad(namedNode(componentMetaDatas[0].uri), namedNode(`${digitaPrefix}shape`), literal('test')));

      expect(() => transformer.fromQuadsOne(quadsTest1, componentMetaDatas[0].uri)).not.toThrow();

    });

    it('should throw if "latest" predicate is not boolean', () => {

      const index = quadsTest1.findIndex((quad) => quad.predicate.value === `${digitaPrefix}latest`);
      quadsTest1[index] = createQuad(namedNode(componentMetaDatas[0].uri), namedNode(`${digitaPrefix}latest`), literal('notboolean'));

      expect(() => transformer.fromQuadsOne(quadsTest1, componentMetaDatas[0].uri)).toThrow(`'${digitaPrefix}latest' should be 'true' or 'false'`);

    });

    it('should not throw if other non-required predicates are included', () => {

      quadsTest1.push(createQuad(namedNode(componentMetaDatas[0].uri), namedNode(`${digitaPrefix}123`), literal('456')));

      expect(() => transformer.fromQuadsOne(quadsTest1, componentMetaDatas[0].uri)).not.toThrow();

    });

    it('should not throw if other predicates from a different subject are included', () => {

      quadsTest1.push(createQuad(namedNode(componentMetaDatas[1].uri), namedNode(`${digitaPrefix}label`), literal('test')));

      expect(() => transformer.fromQuadsOne(quadsTest1, componentMetaDatas[0].uri)).not.toThrow();

    });

    it('should produce the correct metadata', () => {

      expect(transformer.fromQuadsOne(quadsTest1, componentMetaDatas[0].uri)).toEqual(componentMetaDatas[0]);

    });

  });

  describe('fromQuads()', () => {

    it('should produce the correct metadata', () => {

      const metadatas = transformer.fromQuads(quadsAll);
      expect(metadatas).toContainEqual(componentMetaDatas[0]);
      expect(metadatas).toContainEqual(componentMetaDatas[1]);

    });

    it('should return only the metadata that was correctly parsed', () => {

      // the first componentMetadata will be invalid now, because there are too many predicates of "label"
      quadsAll.push(createQuad(namedNode(componentMetaDatas[0].uri), namedNode(`${digitaPrefix}label`), literal('test')));

      // only expect the second metadata
      expect(transformer.fromQuads(quadsAll)).toEqual([ componentMetaDatas[1] ]);

    });

  });

});
