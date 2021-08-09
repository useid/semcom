import { Quad, NamedNode, Literal, Term } from 'n3';
import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';

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
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}shape`), new NamedNode(shape)));

    const quads = [
      new Quad(new NamedNode(component.uri), new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), new NamedNode('http://semcom.digita.ai/voc#component')),
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}label`), new Literal(component.label)),
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}description`),  new Literal(component.description)),
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}author`), new Literal(component.author)),
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}version`), new Literal(component.version)),
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}latest`), new Literal(String(component.latest))),
      new Quad(new NamedNode(component.uri), new NamedNode(`${digitaPrefix}tag`), new Literal(component.tag)),
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
   * Transforms quads to a Components
   *
   * @param quads The quads to transform
   * @param subject The URI of the componentMetadata
   */
  fromQuadsOne(quads: Quad[], uri: string): ComponentMetadata {

    // commented this line out because it resulted in a lot of lagg/delay
    // this.logger.log('debug', 'Transforming quads into component', { quads });

    // maps all predicates for the given URI to its corresponding object
    const uriTriples = new Map<string, string[]>([ ...requiredPredicates ].map((p) => [ p, [] ]));

    quads
      .filter((quad) => quad.subject.value === uri)
      .forEach((element) => uriTriples.get(element.predicate.value)?.push(element.object.value));

    if ([ ...uriTriples.values() ].some((preds) => preds.length === 0)) {

      throw new Error('Some ComponentMetadata predicates were missing while parsing quads.');

    }

    if ([ ...uriTriples.values() ].some((preds) => preds.length > 1)) {

      throw new Error('Too many ComponentMetadata predicates were provided while parsing quads.');

    }

    const latest = uriTriples.get(`${digitaPrefix}latest`)?.[0];

    if (latest !== 'true' && latest !== 'false') {

      throw new Error(`'${digitaPrefix}latest' should be 'true' or 'false'`);

    }

    return {
      uri,
      label: uriTriples.get(`${digitaPrefix}latest`)?.[0] ?? '',
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
   * @param quads The quads to transform
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromQuads(quads: Quad[]): ComponentMetadata[] {

    const typePredicate = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const componentObject = new NamedNode('http://semcom.digita.ai/voc#component');

    return quads
      .filter((quad) => quad.predicate.equals(typePredicate) && quad.object.equals(componentObject))
      .map((quad) => quad.subject.value)
      .map((uri) => this.fromQuadsOne(quads, uri));

  }

}
