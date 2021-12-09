import { ComponentMetadata, QueryComponentService } from '@digita-ai/semcom-core';

/**
 * A { QueryComponentService } that queries the remote component repository for a component.
 */
export class QueryComponentRemoteService extends QueryComponentService {

  private repository: string;

  /**
   * Creates a { QueryComponentRemoteService }.
   *
   * @param { string } repository - The remote component repository to query the components from.
   */
  constructor(repository: string) {

    super();
    this.repository = repository;

  }

  /**
   * Queries the remote component repository for components based upon the given filter.
   *
   * @param { Partial<ComponentMetadata> } filter - The filter to use when querying the remote component repository.
   * @returns List of components matching the filter.
   */
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
