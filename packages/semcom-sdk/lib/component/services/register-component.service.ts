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

    let tag: string;

    if (this.registered.has(componentMetadata.uri)) {

      tag = this.registered.get(componentMetadata.uri);

    } else {

      let component;

      tag = `semcom-${ componentMetadata.tag }-${ btoa(Date.now().toString()).replace('==', '').toLowerCase() }`;

      this.registered.set(componentMetadata.uri, tag);

      console.log('Register element from ', componentMetadata.uri, ' as ', tag);

      try {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = componentMetadata.uri;
        script.onload = (event) => console.log(event);
        document.head.appendChild(script);
      } catch (error) {
        this.registered.delete(componentMetadata.uri);
        console.log(error);

        throw new Error('Something went wrong during import');
      }

      // try {
      //   customElements.define(tag, component.default);
      // } catch (error) {
      //   this.registered.delete(componentMetadata.uri);
      //   throw Error('Failed to register componentMetadata');
      // }

    }

    console.log('DONE');

    return tag;

  }

}
