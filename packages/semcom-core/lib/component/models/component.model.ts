import { ComponentMetadata } from './component-metadata.model';

export interface Component {
  metadata: ComponentMetadata;
  data (
    entry: string,
    customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  ): Promise<void>
}
