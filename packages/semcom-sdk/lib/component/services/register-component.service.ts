/* eslint-disable no-eval -- webpack can't handle dynamic imports */
import jsSHA from 'jssha';
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

    const shaObj = new jsSHA('SHAKE256', 'TEXT');
    shaObj.update(componentMetadata.uri);
    const hash = shaObj.getHash('B64', { outputLen: 64 }).replace(/[+=/]/g, '').toLowerCase();

    const tag = `semcom-${ componentMetadata.tag }-${ hash }`;

    try {

      if (!customElements.get(tag)) {

        const elementComponent = await eval(`import("${encodeURI(componentMetadata.uri)}")`);

        if (!customElements.get(tag)) {

          customElements.define(tag, elementComponent.default);

        }

      }

    } catch (error) {

      throw Error(`Failed to import or register componentMetadata: ${error}`);

    }

    return tag;

  }

}
