import { ComponentMetadata, ManageComponentService } from '@digita-ai/semcom-core';
import { ComponentStore } from '../../store/services/component-store.service';

/**
 * A service to manage the component store.
 */
export class ManageComponentStoreService extends ManageComponentService{

  /**
   * Creates a { ManageComponentStoreService }.
   *
   * @param { ComponentStore } components - The store used to store components.
   */
  constructor(private components: ComponentStore) {

    super();

  }

  /**
   * Saves components into the store.
   *
   * @param { ComponentMetadata[] } components - List of components to store.
   * @returns The components saved in the store.
   */
  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {

    if (!components) {

      throw new Error('Argument components should be set.');

    }

    return this.components.save(components);

  }

}
