import { ComponentMetadata } from '@digita-ai/semcom-core';
import { Store } from './store.service';

export abstract class ComponentStore implements Store<ComponentMetadata>{
  abstract query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]>;
  abstract all(): Promise<ComponentMetadata[]>;
  abstract get(uri: string): Promise<ComponentMetadata[]>;
  abstract save(components: ComponentMetadata[]): Promise<ComponentMetadata[]>;
}
