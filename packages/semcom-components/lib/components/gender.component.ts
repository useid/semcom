/* eslint-disable no-console -- is a web component */
import { NamedNode, Store } from 'n3';
import { css, CSSResult, html, property, PropertyValues } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { BaseComponent } from './base.component';

export class GenderComponent extends BaseComponent {

  @property() gender = 'Unknown';

  private genderPredicate = new NamedNode('http://digita.ai/voc/gender#type');

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse(event: ComponentResponseEvent): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

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

    if (changed.has('entry') && this.entry) this.readData(this.entry);

  }

  static get styles(): CSSResult[] { return []; }

  render() {

    const imgUrl = new URL(`../assets/gender/${this.gender}.png`, import.meta.url);

    return html`
      <img src='${imgUrl.href}'/>
    `;

  }

}

export default GenderComponent;
