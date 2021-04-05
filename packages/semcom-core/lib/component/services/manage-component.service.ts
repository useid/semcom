import { ComponentMetadata } from '../models/component-metadata.model';
import { ManageService } from './manage.service';

export abstract class ManageComponentService implements ManageService<ComponentMetadata> {
  public abstract save(components: ComponentMetadata[]): Promise<ComponentMetadata[]>;
}
