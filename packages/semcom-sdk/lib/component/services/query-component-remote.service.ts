import { ComponentMetadata, QueryComponentService } from '@digita-ai/semcom-core';

export class QueryComponentRemoteService extends QueryComponentService {

  private repository: string;

  constructor(repository: string) {

    super();
    this.repository = repository;

  }

  async query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]> {

    if (!this.repository) {

      throw new Error('Argument this.repository should be set.');

    }

    if (!filter) {

      throw new Error('Argument filter should be set.');

    }

    const response = await fetch(`${this.repository}/component/query`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filter),
    });

    if (!response.ok) {

      throw new Error(`HTTP error! status: ${response.status}`);

    }

    return response.json();

  }

}
