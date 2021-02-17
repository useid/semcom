import {
  AbstractRegisterComponentService,
  ComponentMetadata,
} from '@digita-ai/semcom-core';

export class RegisterComponentService extends AbstractRegisterComponentService {
  private registered: Map<string, string>;

  public async isRegistered(component: ComponentMetadata): Promise<boolean> {
    return this.registered.has(component.uri);
  }

  public register(component: ComponentMetadata): Promise<ComponentMetadata> {
    return;
  }
}
