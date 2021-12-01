import { ComponentMetadata } from '../models/component-metadata.model';
import { QueryService } from './query.service';

/**
 * Represents a service for querying components based on a filter.
 */
export abstract class QueryComponentService implements QueryService<ComponentMetadata> {

  public abstract query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]>;

}
