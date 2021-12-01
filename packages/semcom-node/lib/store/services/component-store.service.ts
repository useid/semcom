import { ComponentMetadata } from '@digita-ai/semcom-core';
import * as semver from 'semver';
import { Store } from './store.service';

/**
 * An abstract class representing a { ComponentStore } that stores components in memory.
 * With a default query method implementation.
 */
export abstract class ComponentStore implements Store<ComponentMetadata>{

  /**
   * Queries the components based on a filter of partial metadata.
   *
   * @returns List of components that match the filter.
   */
  async query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]> {

    const components = await this.all();

    const filtered = components.filter((component) =>
      Object.keys(filter).every((key) => {

        const componentValue = component[key];
        const filterValue = filter[key];

        return (componentValue === filterValue) || (
          Array.isArray(componentValue) &&
            Array.isArray(filterValue) &&
            filterValue.every((value) => componentValue.includes(value))
            || (key === 'version')
        );

      }));

    // seperated version logic for readability

    let versioned = null;

    if(filtered && filter.version) {

      const versions = filtered.map((component) => component.version);
      const maxVersion = semver.maxSatisfying(versions, filter.version);
      versioned = filtered.filter((component) =>  component.version === maxVersion);

    }

    return versioned ?? filtered;

  }

  abstract all(): Promise<ComponentMetadata[]>;
  abstract save(components: ComponentMetadata[]): Promise<ComponentMetadata[]>;

}
