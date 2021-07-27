import { default as Quad } from 'rdf-quad';
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
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#shape', shape));

    return [
      Quad(
        `${component.uri}`,
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        'http://semcom.digita.ai/voc#component',
      ),
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#label', component.label),
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#description', component.description),
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#author', component.author),
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#version', component.version),
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#latest', component.latest),
      Quad(`${component.uri}`, 'http://semcom.digita.ai/voc#tag', component.tag),
      ...shapeQuads,
    ].reduce((acc, val) => acc.concat(val), []);

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
