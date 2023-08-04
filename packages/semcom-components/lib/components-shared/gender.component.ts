/* eslint-disable no-console -- is a web component */
import { NamedNode, Store } from 'n3';
import { CSSResult, html, property, PropertyValues, TemplateResult } from 'lit-element';
import { ComponentResponseEvent } from '@useid/semcom-sdk';
import { ComponentDataTypes } from '@useid/semcom-core';
import { BaseComponent } from './base.component';

export class GenderComponent extends BaseComponent {

  @property() gender = 'Unknown';

  private genderPredicate = new NamedNode('http://digita.ai/voc/gender#type');

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse<D extends keyof ComponentDataTypes>(event: ComponentResponseEvent<D>): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

    }

    if (event.detail.type !== 'quads') {

      throw new Error('Unexpected response type.');

    }

    const store = new Store(event.detail.data);

    this.gender = store.getQuads(null, this.genderPredicate, null, null)[0]?.object.value.split('#')[1];

  }

  /**
   * Is executed when a property value is updated.
   *
   * @param changed Map of changes properties.
   */
  update(changed: PropertyValues): void {

    super.update(changed);

    if (changed.has('entry') && this.entry) this.readData(this.entry, 'quads');

  }

  static get styles(): CSSResult[] { return []; }

  render(): TemplateResult{

    const imgUrl = new URL(`../../public/assets/gender/${this.gender}.png`, import.meta.url);

    return html`
      <img src='${imgUrl.href}'/>
    `;

  }

}

export default GenderComponent;
