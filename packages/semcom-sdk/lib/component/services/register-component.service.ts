/* eslint-disable no-eval -- webpack can't handle dynamic imports */
import { AbstractRegisterComponentService, ComponentMetadata } from '@digita-ai/semcom-core';

export class RegisterComponentService extends AbstractRegisterComponentService {

  private registered: Map<string, string> = new Map();

  async isRegistered(componentMetadata: ComponentMetadata): Promise<boolean> {

    if (!componentMetadata || !componentMetadata.uri) {

      throw Error('Invalid componentMetadata');

    }

    return this.registered.has(componentMetadata.uri);

  }

  async register(componentMetadata: ComponentMetadata): Promise<string> {

    if (!componentMetadata || !componentMetadata.tag || !componentMetadata.uri) {

      throw Error('Invalid componentMetadata');

    }

    let tag: string;

    if (this.registered.has(componentMetadata.uri)) {

      tag = this.registered.get(componentMetadata.uri);

    } else {

      let component;

      tag = `semcom-${ componentMetadata.tag }-${ btoa(Date.now().toString()).replace('==', '').toLowerCase() }`;

      this.registered.set(componentMetadata.uri, tag);

      try {

        component = await eval(`import("${componentMetadata.uri}")`);

      } catch (error) {

        this.registered.delete(componentMetadata.uri);
        throw new Error('Something went wrong during import');

      }

      try {

        customElements.define(tag, component.default);

      } catch (error) {

        this.registered.delete(componentMetadata.uri);
        throw Error('Failed to register componentMetadata');

      }

    }

    return tag;

  }

}
