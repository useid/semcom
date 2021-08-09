import { ComponentMetadata } from '@digita-ai/semcom-core';
import { Parser, Quad } from 'n3';
import { ComponentTransformerService } from '../../component/services/component-transformer.service';
import { ComponentStore } from './component-store.service';

export class ComponentPodStore extends ComponentStore {

  private latestTimestamp = -1;
  private currentlyResolving: Promise<Quad[]> | undefined;
  private latestContents: Quad[] = [];

  constructor(
    private readonly uri: string,
    private readonly transformer: ComponentTransformerService
  ) {

    super();

  }

  private async fetchQuads(): Promise<Quad[]> {

    if (this.currentlyResolving) {

      return this.currentlyResolving;

    } else if (this.latestTimestamp > Date.now() - 10000) {

      return this.latestContents;

    }

    this.latestTimestamp = Date.now();

    this.currentlyResolving = fetch(this.uri, { headers: { 'Accept': 'text/turtle' } })
      .then((response) => response.text())
      .then((body) =>  {

        const quads = new Parser({ format: 'Turtle' }).parse(body);
        this.latestContents = quads;
        this.currentlyResolving = undefined;

        return quads;

      });

    return this.currentlyResolving;

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
