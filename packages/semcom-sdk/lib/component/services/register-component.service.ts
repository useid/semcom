import { AbstractRegisterComponentService, ComponentMetadata } from '@digita-ai/semcom-core';

export class RegisterComponentService extends AbstractRegisterComponentService {
  private registered: Map<string, string> = new Map();

  public async isRegistered(componentMetadata: ComponentMetadata): Promise<boolean> {
    if (!componentMetadata || !componentMetadata.uri) {
      throw Error('Invalid componentMetadata');
    }

    return this.registered.has(componentMetadata.uri);
  }

  public async register(componentMetadata: ComponentMetadata): Promise<string> {
    if (!componentMetadata || !componentMetadata.tag || !componentMetadata.uri) {
      throw Error('Invalid componentMetadata');
    }

    let isRegistered: boolean;
    let component;

    try {
      component = await import(componentMetadata.uri);
      isRegistered = await this.isRegistered(componentMetadata);
    } catch (error) {
      throw new Error('Something went wrong during import');
    }

    if (isRegistered) {
      const encoder = new TextEncoder();
      const data = encoder.encode(componentMetadata.uri);
      const hash = await crypto.subtle.digest('SHA-256', data);

      componentMetadata = {
        ...componentMetadata,
        tag: `${componentMetadata.tag}-${hash}`,
      };
    }

    try {
      customElements.define(componentMetadata.tag, component.default);
      this.registered.set(componentMetadata.uri, componentMetadata.tag);
    } catch (error) {
      throw Error('Failed to register componentMetadata');
    }

    return componentMetadata.tag;
  }
}
