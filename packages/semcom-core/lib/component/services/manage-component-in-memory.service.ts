import * as _ from 'lodash';
import { AbstractManageComponentService } from './abstract-manage-component.service';
import { ComponentMetadata } from '../models/component-metadata.model';
export class ManageComponentInMemoryService extends AbstractManageComponentService {
  private components: ComponentMetadata[] = [];

  constructor(components: ComponentMetadata[]) {
    super();
    this.components = components;
  }

  public async save(
    components: ComponentMetadata[],
  ): Promise<ComponentMetadata[]> {
    if (
      this.components.filter((c) => components.find((component) => component.uri === c.uri)).length === 0
    ) {
      this.components = this.components.concat(components);
    }

    return this.components;
  }
}
