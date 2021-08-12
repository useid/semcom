import { DataFactory, Quad } from 'n3';
import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';

const { namedNode, literal, quad: createQuad } = DataFactory;

const digitaPrefix = 'http://semcom.digita.ai/voc#';

const requiredPredicates: ReadonlySet<string> = new Set([
  `${digitaPrefix}label`,
  `${digitaPrefix}description`,
  `${digitaPrefix}author`,
  `${digitaPrefix}version`,
  `${digitaPrefix}latest`,
  `${digitaPrefix}tag`,
  `${digitaPrefix}shape`,
  `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`,
]);

/** Service that transforms Components */
export class ComponentTransformerService {

  constructor(private logger: LoggerService) {}

  /**
   * Transforms a Component to quads
   *
   * @param component The component to transform
   */
  private toQuadsOne(component: ComponentMetadata): Quad[] {

    this.logger.log('debug', 'Transforming component to quads', { component });

    if (!component) {

      throw new Error('Argument component should be set.');

    }

    const shapeQuads = component.shapes.map((shape) =>
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#shape'), namedNode(shape)));

    const quads = [
      createQuad(namedNode(component.uri), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://semcom.digita.ai/voc#component'),),
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#label'), literal(component.label)),
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#description'),  literal(component.description)),
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#author'), literal(component.author)),
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#version'), literal(component.version)),
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#latest'), literal(String(component.latest))),
      createQuad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#tag'), literal(component.tag)),
      ...shapeQuads,
    ];

    return quads.reduce((acc: Quad[], val) => acc.concat(val), []);

  }

  /**
   * Transforms multiple Components to quads
   *
   * @param components The components to transform
   */
  toQuads(components: ComponentMetadata[]): Quad[] {

    if (!components) {

      throw new Error('Argument components should be set.');

    }

    return components.map((component) => this.toQuadsOne(component)).reduce((acc, val) => acc.concat(val), []);

  }

  /**
   * Retrieves the metadata of a component from an array of quads.
   *
   * @param quads - The quads to transform
   * @param subject - The URI of the componentMetadata
   */
  fromQuadsOne(quads: Quad[], uri: string): ComponentMetadata {

    this.logger.log('debug', 'Transforming quads into component');
    this.logger.log('silly', '', quads.map((quad) => `${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`));

    // maps all predicates for the given URI to its corresponding object
    const uriTriples = new Map<string, string[]>([ ...requiredPredicates ].map((predicate) => [ predicate, [] ]));

    quads
      .filter((quad) => quad.subject.value === uri)
      .forEach((element) => uriTriples.get(element.predicate.value)?.push(element.object.value));

    if ([ ...uriTriples.values() ].some((preds) => preds.length === 0)) {

      throw new Error('Some ComponentMetadata predicates were missing while parsing quads.');

    }

    if ([ ...uriTriples.entries() ].some(([ subject, preds ]) => subject !== `${digitaPrefix}shape` && preds.length > 1)) {

      throw new Error('Too many ComponentMetadata predicates were provided while parsing quads.');

    }

    const latest = uriTriples.get(`${digitaPrefix}latest`)?.[0];

    if (latest !== 'true' && latest !== 'false') {

      throw new Error(`'${digitaPrefix}latest' should be 'true' or 'false'`);

    }

    return {
      uri,
      label: uriTriples.get(`${digitaPrefix}label`)?.[0] ?? '',
      description: uriTriples.get(`${digitaPrefix}description`)?.[0] ?? '',
      author: uriTriples.get(`${digitaPrefix}author`)?.[0] ?? '',
      tag: uriTriples.get(`${digitaPrefix}tag`)?.[0] ?? '',
      version: uriTriples.get(`${digitaPrefix}version`)?.[0] ?? '',
      latest: uriTriples.get(`${digitaPrefix}latest`)?.[0] === 'true',
      shapes: uriTriples.get(`${digitaPrefix}shape`) ?? [],
    };

  }

  /**
   * Transforms quads to Components
   *
   * @param quads - The quads to transform
   */
  fromQuads(quads: Quad[]): ComponentMetadata[] {

    const typePredicate = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const componentObject = namedNode('http://semcom.digita.ai/voc#component');

    return quads
      .filter((quad) => quad.predicate.equals(typePredicate) && quad.object.equals(componentObject))
      .map((quad) => quad.subject.value)
      .map((uri) => this.fromQuadsOne(quads, uri));

  }

}
