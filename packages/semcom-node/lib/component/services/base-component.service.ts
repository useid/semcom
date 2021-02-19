import {
  AbstractManageComponentService,
  AbstractQueryComponentService,
  ComponentMetadata,
} from '@digita-ai/semcom-core';
import { ComponentService } from './component.service';

export class BaseComponentService implements ComponentService {
  private queryService: AbstractQueryComponentService;
  private manageService: AbstractManageComponentService;

  constructor(queryService: AbstractQueryComponentService, manageService: AbstractManageComponentService) {
    this.queryService = queryService;
    this.manageService = manageService;
  }
  public query(filter?: Partial<ComponentMetadata>): Promise<ComponentMetadata[]> {
    return this.queryService.query(filter);
  }

  public save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {
    return this.manageService.save(components);
  }
}
