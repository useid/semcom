/* eslint-disable no-eval -- webpack can't handle dynamic imports */
import { AbstractRegisterComponentService, ComponentMetadata } from '@digita-ai/semcom-core';

export class RegisterComponentService extends AbstractRegisterComponentService {

  async isRegistered(componentMetadata: ComponentMetadata): Promise<boolean> {

    if (!componentMetadata || !componentMetadata.uri) {

      throw Error('Invalid componentMetadata');

    }

    return !!customElements.get(componentMetadata.uri);

  }

  async register(componentMetadata: ComponentMetadata): Promise<string> {

    if (!componentMetadata || !componentMetadata.tag || !componentMetadata.uri) {

      throw Error('Invalid componentMetadata');

    }

    const tag = `semcom-${ componentMetadata.tag }-${ btoa(Date.now().toString()).replace('==', '').toLowerCase() }`;

    let elementComponent;

    try {

      elementComponent = await eval(`import("${componentMetadata.uri}")`);

    } catch (error) {

      throw new Error('Something went wrong during import');

    }

    try {

      if (!customElements.get(tag)) {

        customElements.define(tag, elementComponent.default);

      }

    } catch (error) {

      throw Error(`Failed to register componentMetadata: ${error}`);

    }

    return tag;

  }

}
