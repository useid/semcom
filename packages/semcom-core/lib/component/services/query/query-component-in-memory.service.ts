import { AbstractQueryComponentService } from './abstract-query-component.service';
import { ComponentMetadata } from '../../models/component-metadata.model';

export class QueryComponentInMemoryService extends AbstractQueryComponentService {
  private components: ComponentMetadata[] = [];

  constructor(components: ComponentMetadata[]) {
    super();
    this.components = components;
  }

  public query(
    filter: Partial<ComponentMetadata>,
  ): Promise<ComponentMetadata[]> {
    return Promise.resolve(this.components);
  }
}
