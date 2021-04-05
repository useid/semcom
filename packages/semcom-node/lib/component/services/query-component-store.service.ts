import { ComponentMetadata, QueryComponentService } from '@digita-ai/semcom-core';
import { ComponentStore } from '../../store/services/component-store.service';

export class QueryComponentStoreService extends QueryComponentService {
  constructor(private components: ComponentStore) {
    super();
  }

  public async query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]> {
    return this.components.query(filter);
  }
}
