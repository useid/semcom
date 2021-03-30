import {
  AbstractQueryComponentService,
  ComponentMetadata,
} from '@digita-ai/semcom-core';

export class QueryComponentRemoteService extends AbstractQueryComponentService {
  private repository: string;

  constructor(repository: string) {
    super();
    this.repository = repository;
  }
  public query(
    filter: Partial<ComponentMetadata>,
  ): Promise<ComponentMetadata[]> {
    return new Promise(null);
  }
}
