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
  public async query(
    filter: Partial<ComponentMetadata>,
  ): Promise<ComponentMetadata[]> {
    const response = await fetch(`${this.repository}/component/query`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(filter),
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}
