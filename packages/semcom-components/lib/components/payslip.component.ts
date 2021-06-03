/* eslint-disable no-console -- is a web component */
import { NamedNode, Store } from 'n3';
import { css, html, property, PropertyValues } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { BaseComponent } from './base.component';

export default class PayslipComponent extends BaseComponent {

  @property({ type: Number }) periodStart?: number;
  @property({ type: Number }) periodEnd?: number;
  @property() employee = 'Unknown';
  @property() employer = 'Unknown';
  @property() payType = 'Unknown';
  @property() stature = 'Unknown';
  @property({ type: Number }) grossAmount?: number;
  @property({ type: Number }) taxableAmount?: number;
  @property({ type: Number }) netAmount?: number;

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse(event: ComponentResponseEvent): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

    }

    const pay = 'http://digita.ai/voc/payslip#';

    const store = new Store(event.detail.data);

    this.periodStart = +store.getQuads(null,  new NamedNode(`${pay}from`), null, null)[0]?.object.value * 1000;
    this.periodEnd = +store.getQuads(null,  new NamedNode(`${pay}until`), null, null)[0]?.object.value * 1000;
    this.employee = store.getQuads(null,  new NamedNode(`${pay}employee`), null, null)[0]?.object.value;
    this.employer = store.getQuads(null,  new NamedNode(`${pay}employer`), null, null)[0]?.object.value;
    this.payType = store.getQuads(null,  new NamedNode(`${pay}wageUnit`), null, null)[0]?.object.value;
    this.stature = store.getQuads(null,  new NamedNode(`${pay}stature`), null, null)[0]?.object.value;
    this.grossAmount = +store.getQuads(null,  new NamedNode(`${pay}grossAmount`), null, null)[0]?.object.value;
    this.taxableAmount = +store.getQuads(null,  new NamedNode(`${pay}taxableAmount`), null, null)[0]?.object.value;
    this.netAmount = +store.getQuads(null,  new NamedNode(`${pay}netAmount`), null, null)[0]?.object.value;

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

  static get styles() {

    return [
      css`
        .payslip {
          line-height: 1.6rem;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
        }
        .amounts {
          display: flex;
          justify-content: space-between;
          line-height: 2rem;
        }
        .grey-background {
          color: white;
          background-color: #888;
        }
        .payslip > div {
          padding: 0 10px;
        }
        .infoWrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .infoWrapper > div {
          padding: 0 10px;
        }
      `,
    ];

  }

  render() {

    return html`
    <div class="payslip">
      <div><strong>Period of ${this.periodStart ? new Date(this.periodStart).toLocaleDateString() : 'Unknown'} - ${this.periodEnd ? new Date(this.periodEnd).toLocaleDateString() : 'Unknown'}</strong></div>
      <div class="infoWrapper">
        <div>
          <div><strong>Employee:</strong> ${this.employee}</div>
          <div><strong>Employer:</strong> ${this.employer}</div>
        </div>
        <div>
          <div><strong>Pay type:</strong> ${this.payType.endsWith('#month') ? 'Monthly' : this.payType}</div>
          <div><strong>Stature:</strong> ${this.stature}</div>
        </div>
      </div>

      <hr>
      <div class="amounts"><strong>Gross amount:</strong> ${this.grossAmount ? `€ ${this.grossAmount?.toFixed(2)}` : 'Unknown'}</div>
      <div class="amounts grey-background"><strong>Taxable amount:</strong> ${this.taxableAmount ? `€ ${this.taxableAmount?.toFixed(2)}` : 'Unknown'}</div>
      <div class="amounts"><strong>Net amount:</strong> ${this.netAmount ? `€ ${this.netAmount?.toFixed(2)}` : 'Unknown'}</div>
      <hr>
    </div>
  `;

  }

}
