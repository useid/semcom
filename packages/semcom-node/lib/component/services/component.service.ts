import { ComponentMetadata } from '@digita-ai/semcom-core';

export interface ComponentService {
  query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]>;
  save(component: ComponentMetadata[]): Promise<ComponentMetadata[]>;
}
