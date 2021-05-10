import { ComponentMetadata } from '@digita-ai/semcom-core';
import * as semver from 'semver';
import { ComponentStore } from './component-store.service';

export class ComponentInMemoryStore extends ComponentStore {
  constructor(private components: ComponentMetadata[]) {
    super();
  }

  async query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]> {
    const filtered = this.components.filter((component) =>
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
  async all(): Promise<ComponentMetadata[]> {
    return this.components;
  }
  async get(uri: string): Promise<ComponentMetadata[]> {
    return this.components.filter((component) => uri === component.uri);
  }
  async save(components: ComponentMetadata[]): Promise<ComponentMetadata[]> {
    if (!components) {
      throw new Error('Argument components should be set.');
    }

    if (this.components.filter((c) => components.find((component) => component.uri === c.uri)).length === 0) {
      this.components = this.components.concat(components);
    }

    return components;
  }
}
