import {
  ComponentMetadata,
  ManageComponentInMemoryService,
  QueryComponentInMemoryService,
} from '@digita-ai/semcom-core';
import { ComponentService } from './component.service';

export class BaseComponentService implements ComponentService {
  private queryService: QueryComponentInMemoryService;
  private manageService: ManageComponentInMemoryService;

  constructor(
    queryService: QueryComponentInMemoryService,
    manageService: ManageComponentInMemoryService,
  ) {
    this.queryService = queryService;
    this.manageService = manageService;
  }
  public query(
    filter: Partial<ComponentMetadata>,
  ): Promise<ComponentMetadata[]> {
    return this.queryService.query(filter);
  }

  public save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {
    return this.manageService.save(components);
  }
}
