/* eslint-disable no-console -- is a web component */
import * as N3 from 'n3';
import { LitElement, css, html, property } from 'lit-element';
import type { Component } from '@digita-ai/semcom-core';

export default class PayslipComponent extends LitElement implements Component {

  data (
    entry: string,
    customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  ): Promise<void> {

    const myFetch = customFetch ? customFetch : fetch;
    const parser = new N3.Parser();
    const store = new N3.Store();

    const pay = 'http://digita.ai/voc/payslip#';

    return myFetch(entry)
      .then((response) => response.text())
      .then((text) => {

        store.addQuads(parser.parse(text));
        this.periodStart = +store.getQuads(null,  new N3.NamedNode(`${pay}from`), null, null)[0]?.object.value * 1000;
        this.periodEnd = +store.getQuads(null,  new N3.NamedNode(`${pay}until`), null, null)[0]?.object.value * 1000;
        this.employee = store.getQuads(null,  new N3.NamedNode(`${pay}employee`), null, null)[0]?.object.value;
        this.employer = store.getQuads(null,  new N3.NamedNode(`${pay}employer`), null, null)[0]?.object.value;
        this.payType = store.getQuads(null,  new N3.NamedNode(`${pay}wageUnit`), null, null)[0]?.object.value;
        this.stature = store.getQuads(null,  new N3.NamedNode(`${pay}stature`), null, null)[0]?.object.value;
        this.grossAmount = +store.getQuads(null,  new N3.NamedNode(`${pay}grossAmount`), null, null)[0]?.object.value;
        this.taxableAmount = +store.getQuads(null,  new N3.NamedNode(`${pay}taxableAmount`), null, null)[0]?.object.value;
        this.netAmount = +store.getQuads(null,  new N3.NamedNode(`${pay}netAmount`), null, null)[0]?.object.value;

      });

  }

  @property({ type: Number }) periodStart?: number;
  @property({ type: Number }) periodEnd?: number;
  @property() employee = 'Unknown';
  @property() employer = 'Unknown';
  @property() payType = 'Unknown';
  @property() stature = 'Unknown';
  @property({ type: Number }) grossAmount?: number;
  @property({ type: Number }) taxableAmount?: number;
  @property({ type: Number }) netAmount?: number;

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

  /*
   * W3C Custom Element Specification (from MDN)
   */

  // Invoked each time the element is appended into a DOM (i.e. when node is added or moved).
  connectedCallback() {

    super.connectedCallback();
    console.info('[DGT-PayslipComponent] Element connected');

  }

  // Invoked each time the element is disconnected from a DOM.
  disconnectedCallback() {

    super.disconnectedCallback();
    console.info('[DGT-PayslipComponent] Element disconnected');

  }

  // Invoked each time the custom element is moved to a new DOM.
  adoptedCallback() {

    // super.adoptedCallback();
    console.info('[DGT-PayslipComponent] Element moved to other DOM');

  }

  // Invoked each time one of the element's attributes specified in observedAttributes is changed.
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {

    super.attributeChangedCallback(name, oldValue, newValue);
    console.info(`[DGT-PayslipComponent] Changed ${name} attribute from "${oldValue}" to "${newValue}"`);

  }

}
