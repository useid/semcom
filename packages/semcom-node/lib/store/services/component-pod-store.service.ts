import { ComponentMetadata } from '@useid/semcom-core';
import { Parser, Quad } from 'n3';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { ComponentStore } from './component-store.service';

/**
 * A { ComponentStore } that stores and retrieves component metadata in/from a pod.
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
   *
   * @returns A list of quads retrieved from the webid.
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
   * @returns List of quads retrieved baesed on the metadata name.
   * @
   */
  private async fetchQuads(metadataName: string): Promise<Quad[]> {

    const response = await fetch(`${this.uri}${metadataName}`, { headers: { 'Accept': 'text/turtle' } });
    const text = await response.text();

    return new Parser({ format: 'Turtle' }).parse(text);

  }

  /**
   * Transforms all fetched quads to components.
   *
   * @returns List of all transformed components.
   */
  async all(): Promise<ComponentMetadata[]> {

    const quads = await this.fetchAllQuads();

    return this.transformer.fromQuads(quads);

  }

  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {

    throw new Error('Method not implemented.');

  }

}
