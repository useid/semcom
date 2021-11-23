import { ComponentMetadata } from '../models/component-metadata.model';
import { QueryService } from './query.service';

/**
 * Abstract class representing a service for querying components
 */
export abstract class QueryComponentService implements QueryService<ComponentMetadata> {

  public abstract query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]>;

}
