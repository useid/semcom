import { ComponentMetadata } from '@digita-ai/semcom-core';
import { Parser, Quad } from 'n3';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { ComponentStore } from './component-store.service';

/**
 * A { ComponentStore } fetch quads from a pod and retrieves the metadata of a component from an array of quads.
 */
export class ComponentPodStore extends ComponentStore {

  /**
   * Creates a { ComponentPodStore }.
   *
   * @param { string } uri - The URI of the pod.
   * @param { ComponentTransformerService } transformer - Service used to transform components.
   */
  constructor(
    private readonly uri: string,
    private readonly transformer: ComponentTransformerService
  ) { super(); }

  /**
   * Fetches all quads from the URI of the pod.
   */
  private async fetchAllQuads(): Promise<Quad[]> {

    const response = await fetch(this.uri, { headers: { 'Accept': 'text/turtle' } });
    const body = await response.text();

    const components = new Parser({ format: 'Turtle' }).parse(body)
      .filter((quad) => quad.object.value === 'http://www.w3.org/ns/ldp#Resource')
      .filter((quad) => quad.subject.value !== '')
      .map((quad) => quad.subject.value);

    const allQuads: Quad[][] = await Promise.all(components.map((component) => this.fetchQuads(component)));

    return allQuads.flat();

  }

  /**
   * Fetch the specified quads from the URI of the pod.
   *
   * @param { string } metadataName - The name of the component to fetch.
   */
  private async fetchQuads(metadataName: string): Promise<Quad[]> {

    const response = await fetch(`${this.uri}${metadataName}`, { headers: { 'Accept': 'text/turtle' } });
    const text = await response.text();

    return new Parser({ format: 'Turtle' }).parse(text);

  }

  /**
   * Transforms all fetched quads to components.
   */
  async all(): Promise<ComponentMetadata[]> {

    const quads = await this.fetchAllQuads();

    return this.transformer.fromQuads(quads);

  }

  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {

    throw new Error('Method not implemented.');

  }

}
