import { ComponentMetadata } from './component-metadata.model';

export interface Component {
  
  metadata: ComponentMetadata;

  setData(data): void;

}
