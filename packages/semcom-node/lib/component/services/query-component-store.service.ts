import { ComponentMetadata, QueryComponentService } from '@digita-ai/semcom-core';
import { ComponentStore } from '../../store/services/component-store.service';

/**
 * Queries components from the store based on a filter.
 */
export class QueryComponentStoreService extends QueryComponentService {

  /**
   * Creates a { QueryComponentStoreService }.
   *
   * @param { ComponentStore } components - The store used to query components from.
   */
  constructor(private components: ComponentStore) {

    super();

  }

  /**
   * Queries the components store based upon the specified filter
   *
   * @param { Partial<ComponentMetadata> } filter - The partial component metadata to filter by.
   */
  async query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]> {

    return this.components.query(filter);

  }

}
