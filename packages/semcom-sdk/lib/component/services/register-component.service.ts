import { AbstractRegisterComponentService, ComponentMetadata } from '@digita-ai/semcom-core';

export class RegisterComponentService extends AbstractRegisterComponentService {
  private registered: Map<string, string>;

  public async isRegistered(component: ComponentMetadata): Promise<boolean> {
    if (!component) {
      throw new Error('Argument component should be set.');
    }

    return this.registered.has(component.uri);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public register(component: ComponentMetadata): Promise<ComponentMetadata> {
    return;
  }
}
