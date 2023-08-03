import { NamedNode, Store } from 'n3';
import { css, CSSResult, html, property, PropertyValues, TemplateResult, unsafeCSS } from 'lit-element';
import { ComponentResponseEvent } from '@useid/semcom-sdk';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { Image, Theme } from '@useid/dgt-theme';
import { ComponentDataTypes } from '@useid/semcom-core';
import { BaseComponent } from './base.component';

export interface ProfilePayslip {
  employer: string;
  amount: string;
  from: string;
}

export class ProfilePayslipComponent extends BaseComponent {

  readonly foaf = 'http://xmlns.com/foaf/0.1/';
  readonly n = 'http://www.w3.org/2006/vcard/ns#';
  readonly pay = 'http://digita.ai/voc/payslip#';

  @property() payslips?: ProfilePayslip[] = [];
  @property() canSave = false;

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
    const tempPayslips: ProfilePayslip[] = [];

    store.getQuads(null, null, new NamedNode(`${this.pay}payslip`), null).map((payslip) => {

      const employer = store.getQuads(new NamedNode(payslip.subject.value), new NamedNode(`${this.pay}employer`), null, null)[0]?.object.value;
      const amount = store.getQuads(new NamedNode(payslip.subject.value), new NamedNode(`${this.pay}netAmount`), null, null)[0]?.object.value;
      const from = store.getQuads(new NamedNode(payslip.subject.value), new NamedNode(`${this.pay}from`), null, null)[0]?.object.value;

      const date = new Date(+from * 1000);

      tempPayslips.push({
        employer,
        amount,
        from: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
      });

    });

    this.payslips = tempPayslips;

  }

  static get styles(): CSSResult[] {

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

        .payslip {
          display: flex;
          flex-direction: row;
          background-color: #eee;
          padding: 10px;
        }

        .payslip .employer {
          margin-left: 20px;
          margin-right: 0px;
          flex: 1 1;
        }
        .payslip .amount {
          font-weight: bold;
        }
      `,
    ];

  }

  render(): TemplateResult {

    return this.payslips && this.payslips.length > 0 ? html`
        
    <nde-card hideImage>
      <div slot="title">Payslips</div>
      <div slot="subtitle">Your payslips</div>
      <div slot="icon">
        ${unsafeSVG(Image)}
      </div>
      <div slot="content">
        ${this.payslips.map((payslip) => html`
          <div class="payslip">
          <div class="from">
            ${payslip.from}
          </div>
          <div class="employer">
            ${payslip.employer}
          </div>
          <div class="amount">
            €${payslip.amount}
          </div>
          </div>
        `)}
      </div>
    </nde-card>
      ` : html``;

  }

}

export default ProfilePayslipComponent;
