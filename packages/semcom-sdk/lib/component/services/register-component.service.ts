/* eslint-disable no-eval -- webpack can't handle dynamic imports */
import jsSHA from 'jssha';
import { AbstractRegisterComponentService, ComponentMetadata } from '@useid/semcom-core';

/**
 * A { AbstractRegisterComponentService } that registers a component.
 */
export class RegisterComponentService extends AbstractRegisterComponentService {

  /**
   * Checks if the component is already registered.
   *
   * @param { ComponentMetadata } componentMetadata - The component metadata to check.
   */
  async isRegistered(componentMetadata: ComponentMetadata): Promise<boolean> {

    if (!componentMetadata || !componentMetadata.uri) {

      throw Error('Invalid componentMetadata');

    }

    return !!customElements.get(componentMetadata.uri);

  }

  /**
   * Registers the component.
   *
   * @param { ComponentMetadata } componentMetadata - The component metadata to register.
   * @returns The tag of the registered component.
   */
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
