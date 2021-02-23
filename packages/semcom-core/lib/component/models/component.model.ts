import { ComponentMetadata } from './component-metadata.model';

export interface Component {
  metadata: ComponentMetadata;
  rdfData(data): void;
}
