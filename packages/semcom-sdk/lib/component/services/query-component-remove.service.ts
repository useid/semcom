import {
  ComponentMetadata,
  QueryComponentService,
} from '@digita-ai/semcom-core';

export class QueryComponentRemoteService extends QueryComponentService {
  private repository: string;

  constructor(repository: string) {
    super();
    this.repository = repository;
  }
  query(
    filter: Partial<ComponentMetadata>,
  ): Promise<ComponentMetadata[]> {
    return new Promise(null);
  }
}
