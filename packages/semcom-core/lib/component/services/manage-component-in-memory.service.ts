import { AbstractManageComponentService } from './abstract-manage-component.service';
import { ComponentMetadata } from '../models/component-metadata.model';

export class ManageComponentInMemoryService extends AbstractManageComponentService {
  private components: ComponentMetadata[] = [];

  constructor(components: ComponentMetadata[]) {
    super();
    this.components = components;
  }

  public async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {
    return this.components.concat(components);
  }
}
