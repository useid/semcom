import { AbstractQueryComponentService } from './abstract-query-component.service';
import { ComponentMetadata } from '../models/component-metadata.model';
import { _ } from 'lodash';

export class QueryComponentInMemoryService extends AbstractQueryComponentService {
  private components: ComponentMetadata[] = [];

  constructor(components: ComponentMetadata[]) {
    super();
    this.components = components;
  }

  public async query(
    filter: Partial<ComponentMetadata>,
  ): Promise<ComponentMetadata[]> {
    return _.filter(this.components, filter);
  }
}
