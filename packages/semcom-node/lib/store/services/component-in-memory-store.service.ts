import { ComponentMetadata } from '@digita-ai/semcom-core';
import { ComponentStore } from './component-store.service';

export class ComponentInMemoryStore extends ComponentStore {

  constructor(private components: ComponentMetadata[]) {

    super();

  }

  async all(): Promise<ComponentMetadata[]> {

    return this.components;

  }

  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {

    if (!components) {

      throw new Error('Argument components should be set.');

    }

    if (this.components.filter((c) => components.find((component) => component.uri === c.uri)).length === 0) {

      this.components = this.components.concat(components);

    }

    return components;

  }

}
