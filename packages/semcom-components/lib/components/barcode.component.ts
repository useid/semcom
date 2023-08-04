/* eslint-disable no-console -- is a web component */
import { Store } from 'n3';
import { css, CSSResult, html, state, property, PropertyValues, query, TemplateResult, unsafeCSS } from 'lit-element';
import { ComponentResponseEvent } from '@useid/semcom-sdk';
import { Theme, QR, Open } from '@useid/dgt-theme';
import JsBarcode from 'jsbarcode';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { ComponentDataTypes } from '@useid/semcom-core';
import { BaseComponent } from './base.component';

export class BarcodeComponent extends BaseComponent {

  @state() cardNumber?: string;
  @state() program?: string;
  @state() hostingOrganization?: string;
  @property({ type: Boolean }) hideProgram = false;

  @query('#barcode') barcodeSvg?: HTMLOrSVGElement;

  /**
   * Handles a response event.
   * Expects an event containing a detail object that contains a data object containing quads. Will take the first quad containing a membershipNumber it finds.
   * Make sure to filter the quads you send it if you want a specific barcode.
   *
   * @param event The response event to handle.
   */
  handleResponse<D extends keyof ComponentDataTypes>(event: ComponentResponseEvent<D>): void {

    console.log('handleResponse');

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Arguments event, event.detail, and event.detail.data should be set.');

    }

    const store = new Store(event.detail.data);

    const quad = store.getQuads(null, 'http://schema.org/membershipNumber', null, null)[0];

    const program = store.getQuads(quad.subject, 'http://schema.org/programName', null, null)[0];
    const hostingOrganization = store.getQuads(quad.subject, 'http://schema.org/hostingOrganization', null, null)[0];

    this.cardNumber = quad.object.value;
    this.program = program.object.value;
    this.hostingOrganization = hostingOrganization?.object?.value;

  }

  updated(changed: PropertyValues): void {

    if (changed.has('entry') && this.entry) this.readData(this.entry, 'quads');

    if (this.barcodeSvg && this.cardNumber) {

      JsBarcode(this.barcodeSvg, this.cardNumber, {
        background: 'none',
      });

    }

    super.updated(changed);

  }

  render(): TemplateResult {

    return html`
      ${this.program && !this.hideProgram ? html`
        <nde-card ?hideImage="${ true }">
          <div slot="title">${this.program}</div>
          <div slot="subtitle">This is your barcode</div>
          <div slot="icon">
            ${unsafeSVG(QR)}
          </div>
          <div slot="content">
            <div class="barcode-container">
              <svg id="barcode"></svg>
            </div>
            ${this.hostingOrganization ? html`<a target="_blank" .href="${this.hostingOrganization}" class="btn primary">${unsafeSVG(Open)} <div>More information</div></a>` : ``}
          </div>
        </nde-card>
      ` : ''}
    `;

  }

  static get styles(): CSSResult[] {

    return [
      unsafeCSS(Theme),
      css`
        div[slot="icon"] svg {
          fill: var(--colors-foreground-normal);
        }

        div[slot="content"] {
          display: flex;
          align-items: stretch;
          flex-direction: column;
        }

        a.btn {
          display: flex;
          align-items: center;
          flex-direction: row;
          margin-top: var(--gap-large);
          justify-content: center;
        }

        a.btn svg {
          fill: var(--colors-foreground-inverse);
          margin-right: var(--gap-normal);
        }

        .barcode-container {
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .barcode-container #barcode {
          width: 200px;
          height: 110px;  
        }
      `,
    ];

  }

}

export default BarcodeComponent;
