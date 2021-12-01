import { ComponentMetadata } from '@digita-ai/semcom-core';
import { ComponentStore } from './component-store.service';

/**
 * A { ComponentStore } that stores components in memory.
 */
export class ComponentInMemoryStore extends ComponentStore {

  /**
   * Creates a { ComponentInMemoryStore }.
   *
   * @param { ComponentMetadata[] } components - List of component metadata.
   */
  constructor(private components: ComponentMetadata[]) {

    super();

  }

  /**
   * @returns the entire list of components metadata.
   */
  async all(): Promise<ComponentMetadata[]> {

    return this.components;

  }

  /**
   * Compares the list of components provided with the current list of components and merges the differences.
   *
   * @param { ComponentMetadata[] } components - List of component metadata.
   * @returns List of the components saved.
   */
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
