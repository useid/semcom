import { ComponentMetadata } from '@digita-ai/semcom-core';
import { Parser, Quad } from 'n3';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { ComponentStore } from './component-store.service';

export class ComponentPodStore extends ComponentStore {

  constructor(
    private readonly uri: string,
    private readonly transformer: ComponentTransformerService
  ) {

    super();

  }

  private async fetchQuads(): Promise<Quad[]> {

    return fetch(this.uri, { headers: { 'Accept': 'text/turtle' } })
      .then((response) => response.text())
      .then((body) =>   new Parser({ format: 'Turtle' }).parse(body));

  }

  async all(): Promise<ComponentMetadata[]> {

    const quads = await this.fetchQuads();

    return this.transformer.fromQuads(quads);

  }
  async get(uri: string): Promise<ComponentMetadata[]> {

    const quads = await this.fetchQuads();

    return [ this.transformer.fromQuadsOne(quads, uri) ];

  }
  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {

    throw new Error('Method not implemented.');

  }

}
