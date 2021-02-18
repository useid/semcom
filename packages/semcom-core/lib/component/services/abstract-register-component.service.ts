import { ComponentMetadata } from '../models/component-metadata.model';

export abstract class AbstractRegisterComponentService {
  public abstract isRegistered(component: ComponentMetadata): Promise<boolean>;

  public abstract register(
    component: ComponentMetadata,
  ): Promise<string>;
}
