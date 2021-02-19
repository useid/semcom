import { ComponentMetadata } from '../models/component-metadata.model';
import { QueryService } from './query.service';

export abstract class AbstractQueryComponentService implements QueryService<ComponentMetadata> {
  public abstract query(filter: Partial<ComponentMetadata>): Promise<ComponentMetadata[]>;
}
