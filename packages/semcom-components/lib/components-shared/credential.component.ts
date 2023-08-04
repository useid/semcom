
import { NamedNode, Store } from 'n3';
import { css, CSSResult, html, property, PropertyValues, TemplateResult, unsafeCSS } from 'lit-element';
import { ComponentResponseEvent } from '@useid/semcom-sdk';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { Image, Theme } from '@useid/dgt-theme';
import { ComponentDataTypes } from '@useid/semcom-core';
import { BaseComponent } from './base.component';

export interface Credential {
  uri: string;
  type: string;
  document: string;
  owner: string;
}

export class CredentialComponent extends BaseComponent {

  readonly schema = 'https://schema.org/';
  readonly digita = 'http://digita.ai/voc/example#';
  readonly rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

  @property() credentials?: Credential[] = [];

  /**
   * Is executed when a property value is updated.
   *
   * @param changed Map of changes properties.
   */
  update(changed: PropertyValues): void {

    super.update(changed);

    if (changed.has('entry') && this.entry) {

      this.readData(this.entry, 'quads');

    }

  }

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse<D extends keyof ComponentDataTypes>(event: ComponentResponseEvent<D>): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

    }

    const store = new Store(event.detail.data);
    const tempCredentials: Credential[] = [];

    store.getQuads(null, new NamedNode(`${this.schema}hasCredential`), null, null).map((credential) => {

      const owner = credential?.subject.value;
      const uri = credential?.object.value;
      const type = store.getQuads(uri, new NamedNode(`${this.rdf}type`), null, null)[0]?.object.value;
      const document = store.getQuads(uri, new NamedNode(`${this.schema}uri`), null, null)[0]?.object.value;

      tempCredentials.push({ owner, uri, type, document });

    });

    this.credentials = tempCredentials;

  }

  static get styles(): CSSResult[]{

    return [
      unsafeCSS(Theme),
      css`
        div[slot="content"] {
          display: flex;
          flex-direction: column;
        }

        div[slot="content"] > * {
          margin-bottom: var(--gap-small);
        }

        .credential {
          display: flex;
          flex-direction: row;
          background-color: #eee;
          padding: 10px;
        }

        .credential .type {
          margin-left: 20px;
          margin-right: é0px;
          flex: 1 1;
        }
        .credential .document a {
          font-weight: bold;
        }
      `,
    ];

  }

  render(): TemplateResult {

    return this.credentials && this.credentials.length > 0 ? html`
        
    <card-component .showImage="${ false }">
      <div slot="title">Credentials</div>
      <div slot="subtitle">Your credentials</div>
      <div slot="icon">
        ${unsafeSVG(Image)}
      </div>
      <div slot="content">
        ${this.credentials.map((credential) => html`
          <div class="credential">
          <div class="type">
            ${credential.type}
          </div>
          <div class="document">
            <a .href="${credential.document}" target="_blank">Download</a>
          </div>
          </div>
        `)}
      </div>
    </card-component>
      ` : html``;

  }

}

export default CredentialComponent;
