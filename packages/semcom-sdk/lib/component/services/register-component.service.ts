import {
  AbstractRegisterComponentService,
  ComponentMetadata,
} from '@digita-ai/semcom-core';

export class RegisterComponentService extends AbstractRegisterComponentService {
  private registered: Map<string, string> = new Map();

  public async isRegistered(
    componentMetadata: ComponentMetadata,
  ): Promise<boolean> {
    if (!componentMetadata || !componentMetadata.uri) {
      throw Error('Invalid componentMetadata');
    }

    return this.registered.has(componentMetadata.uri);
  }

  public async register(componentMetadata: ComponentMetadata): Promise<string> {
    if (
      !componentMetadata ||
      !componentMetadata.tag ||
      !componentMetadata.uri
    ) {
      throw Error('Invalid componentMetadata');
    }

    const isRegistered = await this.isRegistered(componentMetadata);

    const component = await import(componentMetadata.uri);

    if (isRegistered) {
      const encoder = new TextEncoder();
      const data = encoder.encode(componentMetadata.uri);
      const hash = await crypto.subtle.digest('SHA-256', data);

      componentMetadata = {
        ...componentMetadata,
        tag: `${componentMetadata.tag}-${hash}`,
      };
    }

    this.registered.set(componentMetadata.uri, componentMetadata.tag);
    customElements.define(componentMetadata.tag, component.default);
    return componentMetadata.tag;
  }
}
