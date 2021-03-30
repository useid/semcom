import { AbstractManageComponentService } from './abstract-manage-component.service';
import { ComponentMetadata } from '../../models/component-metadata.model';

export class ManageComponentInMemoryService extends AbstractManageComponentService {
  private components: ComponentMetadata[] = [];

  constructor(components: ComponentMetadata[]) {
    super();
    this.components = components;
  }

  public save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {
    return Promise.resolve(this.components.concat(components));
  }
}
