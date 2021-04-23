import { ComponentMetadata, ManageComponentService } from '@digita-ai/semcom-core';
import { ComponentStore } from '../../store/services/component-store.service';

export class ManageComponentStoreService extends ManageComponentService{

  constructor(private components: ComponentStore) {
    super();
  }

  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {
    if (!components) {
      throw new Error('Argument components should be set.');
    }

    return this.components.save(components);
  }
}
