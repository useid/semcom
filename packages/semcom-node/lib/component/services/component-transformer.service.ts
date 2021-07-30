import { Quad, NamedNode, Literal } from 'n3';
import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';

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
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#shape'), new Literal(shape)));

    const quads = [
      new Quad(new NamedNode(component.uri), new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), new NamedNode('http://semcom.digita.ai/voc#component'),),
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#label'), new Literal(component.label)),
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#description'),  new Literal(component.description)),
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#author'), new Literal(component.author)),
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#version'), new Literal(component.version)),
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#latest'), new Literal(String(component.latest))),
      new Quad(new NamedNode(component.uri), new NamedNode('http://semcom.digita.ai/voc#tag'), new Literal(component.tag)),
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
   * Transforms quads to a Component
   *
   * @param quads The quads to transform
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromQuads(quads: Quad[]): ComponentMetadata {

    throw new Error('Not implemented');

  }

}
