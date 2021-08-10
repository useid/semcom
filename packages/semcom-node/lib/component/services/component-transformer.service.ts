import { DataFactory, Quad } from 'n3';
import { ComponentMetadata, LoggerService } from '@digita-ai/semcom-core';
const { namedNode, literal, quad } = DataFactory;

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
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#shape'), namedNode(shape)));

    const quads = [
      quad(namedNode(component.uri), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://semcom.digita.ai/voc#component'),),
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#label'), literal(component.label)),
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#description'),  literal(component.description)),
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#author'), literal(component.author)),
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#version'), literal(component.version)),
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#latest'), literal(String(component.latest))),
      quad(namedNode(component.uri), namedNode('http://semcom.digita.ai/voc#tag'), literal(component.tag)),
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
