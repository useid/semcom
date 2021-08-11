import { ComponentMetadata } from '@digita-ai/semcom-core';
import jsSHA from 'jssha';
import { Parser, Quad } from 'n3';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { ComponentStore } from './component-store.service';

export class ComponentPodStore extends ComponentStore {

  constructor(
    private readonly uri: string,
    private readonly transformer: ComponentTransformerService
  ) { super(); }

  private async fetchAllQuads(): Promise<Quad[]> {

    const body = await fetch(this.uri, { headers: { 'Accept': 'text/turtle' } })
      .then((response) => response.text());

    const components = new Parser({ format: 'Turtle' }).parse(body)
      .filter((q) => q.object.value === 'http://www.w3.org/ns/ldp#Resource')
      .filter((q) => q.subject.value !== '')
      .map((q) => q.subject.value);

    const allQuads: Quad[][] = await Promise.all(([ ... components ]).map((component) => this.fetchQuads(component)));

    return allQuads.flat();

  }

  private async fetchQuads(metadataName: string): Promise<Quad[]> {

    return fetch(`${this.uri}${metadataName}`, { headers: { 'Accept': 'text/turtle' } })
      .then((response) => response.text())
      .then((text) =>  new Parser({ format: 'Turtle' }).parse(text));

  }

  async all(): Promise<ComponentMetadata[]> {

    const quads = await this.fetchAllQuads();

    return this.transformer.fromQuads(quads);

  }

  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {

    throw new Error('Method not implemented.');

  }

}
