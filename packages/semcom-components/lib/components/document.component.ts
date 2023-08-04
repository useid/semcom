import { NamedNode, Store } from 'n3';
import { ComponentDataTypes } from '@useid/semcom-core';
import { css, CSSResult, html, property, TemplateResult, unsafeCSS } from 'lit-element';
import { ComponentResponseEvent } from '@useid/semcom-sdk';
import { Document, Arrow, Theme } from '@useid/dgt-theme';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { BaseComponent } from './base.component';

export class DocumentComponent extends BaseComponent {

  @property() documents?: { url: string; fileName: string }[] = [ { url: 'http://test.com', fileName: 'test' } ];
  @property() url?: string;
  @property() fileName?: string;

  handleResponse<D extends keyof ComponentDataTypes>(event: ComponentResponseEvent<D>): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.data should be set.');

    }

    if (event.detail.type !== 'quads') {

      throw new Error('Unexpected response type.');

    }

    const n = 'http://www.w3.org/2006/vcard/ns#';

    const store = new Store(event.detail.data);

    this.fileName = store.getQuads(null, new NamedNode(`${n}fileName`), null, null)[0]?.object.value;
    this.url = store.getQuads(null, new NamedNode(`${n}url`), null, null)[0]?.object.value;

    this.documents?.push({ url: this.url, fileName: this.fileName });

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
        margin-bottom: var(--gap-large);
      }
      
      .link {
        text-decoration: none;
      }

      .document {
        display: flex;
        flex-direction: row;
        background-color: #eee;
        padding: 10px;
        cursor: pointer;
      }

      .document .icon {
        display: flex;
        align-items: center; 
        justify-content: center;
        padding: 10px;
      }

      .document .filename {
          margin-left: var(--gap-small);    
      }

      .document .arrow {
        display: flex;
        align-items: center; 
        justify-content: center;
        margin-left: auto;
      }
      `,
    ];

  }

  render(): TemplateResult {

    return this.documents && this.documents.length > 0 ? html `

    <nde-card hideImage>
      <div slot="title">Documents</div>
      <div slot="subtitle">These are your documents</div>
      <div slot="icon">
        ${unsafeSVG(Document)}
      </div>
      <div slot="content">
      ${this.documents.map((document) => html`
      <a class="link" href=${document.url}>
        <div class="document">
        
                <div class="icon">
                    ${unsafeSVG(Document)}
                </div>
                <div class="filename">
                    <p>${document.fileName}</p>
                </div>
                <div class="arrow"> ${unsafeSVG(Arrow)} </div>
            </div>
        </a>`)}
      </div>
      </nde-card>
    `: html``;

  }

}

export default DocumentComponent;
