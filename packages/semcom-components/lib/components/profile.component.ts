import { NamedNode, Store } from 'n3';
import { css, html, property, PropertyValues } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { BaseComponent } from './base.component';

export class ProfileComponent extends BaseComponent {

  @property({ type: String }) entry: string;

  @property() name?: string;
  @property() avatar = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  @property() job?: string;
  @property() company?: string;
  @property() city?: string;
  @property() country?: string;
  @property() about?: string;
  @property({ type: Array }) phones?: string[] = [];
  @property({ type: Array }) emails?: string[] = [];

  update(changed: PropertyValues): void {

    super.update(changed);

    if (changed.has('entry')) this.readData(this.entry);

  }

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse(event: ComponentResponseEvent): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

    }

    const foaf = 'http://xmlns.com/foaf/0.1/';
    const n = 'http://www.w3.org/2006/vcard/ns#';

    const store = new Store(event.detail.data);

    this.name = store.getQuads(null,  new NamedNode(`${foaf}name`), null, null)[0]?.object.value;
    this.avatar = store.getQuads(null, new NamedNode(`${n}hasPhoto`), null, null)[0]?.object.value;
    this.job = store.getQuads(null, new NamedNode(`${n}role`), null, null)[0]?.object.value;
    this.company = store.getQuads(null, new NamedNode(`${n}organization-name`), null, null)[0]?.object.value;
    this.city = store.getQuads(null, new NamedNode(`${n}locality`), null, null)[0]?.object.value;
    this.country = store.getQuads(null, new NamedNode(`${n}country-name`), null, null)[0]?.object.value;
    this.about = store.getQuads(null, new NamedNode(`${n}note`), null, null)[0]?.object.value;

    store.getQuads(null, new NamedNode(`${n}hasTelephone`), null, null).map((tele) => {

      this.phones?.push(store.getQuads(new NamedNode(tele.object.value), new NamedNode(`${n}value`), null, null)[0]?.object.value.split(':')[1]);

    });

    store.getQuads(null, new NamedNode(`${n}hasEmail`), null, null).map((mail) => {

      this.emails?.push(store.getQuads(new NamedNode(mail.object.value), new NamedNode(`${n}value`), null, null)[0]?.object.value.split(':')[1]);

    });

  }

  static get styles() {

    return [
      css`
        :host {
          font-family: 'Roboto', sans-serif;
          font-weight: 300;
        }
        .container {
          width: 100%;
          text-align: center;
          padding: 40px 0;
        }
        #avatar {
          border-radius: 50%;
          border: 1px solid black;
          width: 200px;
          height: 200px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
        }
        .title {
          font-size: 1.7rem;
        }
        .title, #info, #about, .contact-container-wrapper {
          margin-top: 40px;
        }
        #about {
          font-size: 0.8rem;
        }
        #info {
          line-height: 1.5rem;
        }
        .contact-container {
          width: 80%;
          margin-left: auto;
          margin-right: auto;
          color: #2F363C;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
        .contact-container > div {
          border: 2px solid #2F363C;
          padding: 10px 25px 10px calc(25px + 1rem);
          margin: 10px 0;
        }
        .contact-container > div > div {
          padding-left: 10px;
        }
        .email, .phone {
          position: relative;
        }
        svg {
          height: 1rem;
        }
        .email svg, .phone svg {
          position: absolute;
          top: 50%;
          -webkit-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(-50%);
          left: 25px;
          margin: auto;
          text-align: center;
        }
      `,
    ];

  }

  render() {

    return html`
    <div class="container">
      <img id="avatar" src="${this.avatar}" alt="avatar">
      <div class="title">${this.name}</div>
      <div id="info">
        ${this.job || this.company ? html`
          <div>${this.job ?? ''}${this.company && this.job ? ' at ' : this.company ? 'Works at ': ''}${this.company ?? ''}</div>
        ` : ''}
        ${this.city || this.country ? html`
          <div>
            <svg viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.17168 0C10.7705 0 13.6924 2.91547 13.6924 6.54204C13.6924 10.0264 10.4855 15.1462 8.13374 17.5995C7.59926 18.1328 6.70846 18.1328 6.20961 17.5995C3.82225 15.1462 0.615356 10.0264 0.615356 6.54204C0.615356 2.91547 3.53719 0 7.17168 0ZM7.17168 1.06664C4.10731 1.06664 1.68432 3.48435 1.68432 6.54204C1.68432 9.74195 4.78432 14.6129 6.95788 16.8884C7.06478 16.9951 7.24294 16.9951 7.34984 16.8884C9.5234 14.6129 12.6234 9.74195 12.6234 6.54204C12.6234 3.48435 10.2004 1.06664 7.17168 1.06664Z" fill="#2F363C"/>
              <path d="M7.17173 3.30657C8.95334 3.30657 10.3786 4.72875 10.3786 6.54204C10.3786 8.31976 8.95334 9.74194 7.17173 9.74194C5.35449 9.74194 3.9292 8.31976 3.9292 6.54204C3.9292 4.72875 5.35449 3.30657 7.17173 3.30657ZM7.17173 4.33765C5.96023 4.33765 4.96253 5.33318 4.96253 6.54204C4.96253 7.71534 5.96023 8.71086 7.17173 8.71086C8.34759 8.71086 9.34529 7.71534 9.34529 6.54204C9.34529 5.33318 8.34759 4.33765 7.17173 4.33765Z" fill="#2F363C"/>
            </svg>
            ${this.city?.toUpperCase()}${this.city && this.country ? ', ': ''}${this.country?.toUpperCase()}
          </div>
        ` : ''}
      </div>

      <!-- ABOUT / DESCRIPTION -->
      ${this.about ? html`
        <div id="about">${this.about}</div>
      ` : ''}

      <!-- CONTACT INFORMATION -->
      <div class="contact-container-wrapper">
        ${(this.phones && this.phones.length > 0) ? html`
          <div class="contact-container">
            ${this.phones?.map((phone) => html`
              <div class="phone">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.4841 5.20831C15.0571 4.14081 14.4166 3.18975 13.6014 2.37457C12.7862 1.55938 11.8351 0.938282 10.7676 0.49187C10.2436 0.278368 9.70012 0.123094 9.15666 0.00663909C8.96257 -0.0321794 8.76848 0.103685 8.72966 0.297778C8.69084 0.49187 8.82671 0.685962 9.0208 0.724781C9.52544 0.821827 10.0301 0.957691 10.4959 1.15178C11.4664 1.53997 12.3398 2.12225 13.0773 2.87921C13.8149 3.61676 14.3972 4.49017 14.8048 5.46063C14.9988 5.94586 15.1541 6.4311 15.2318 6.93574C15.2706 7.11042 15.4064 7.22687 15.5811 7.22687C15.6005 7.22687 15.6199 7.22687 15.6394 7.22687C15.8334 7.18806 15.9693 6.99396 15.9305 6.79987C15.8529 6.27582 15.6976 5.73236 15.4841 5.20831Z" fill="#2F363C"/>
                  <path d="M8.39967 3.07329C8.80727 3.13152 9.21486 3.24798 9.58364 3.40325C10.263 3.67498 10.8646 4.08257 11.3693 4.58721C11.8933 5.11126 12.2815 5.71295 12.5532 6.37286C12.7085 6.76105 12.825 7.14923 12.8832 7.55683C12.9026 7.73151 13.0579 7.86737 13.2326 7.86737C13.252 7.86737 13.2714 7.86737 13.2908 7.86737C13.4849 7.82855 13.6208 7.65387 13.5819 7.45978C13.5043 6.99396 13.3878 6.54754 13.2132 6.10113C12.9026 5.34417 12.4562 4.64544 11.8739 4.06316C11.2916 3.48089 10.6123 3.01507 9.83596 2.72393C9.40895 2.54924 8.94313 2.41338 8.49672 2.35515C8.30263 2.31633 8.10853 2.4522 8.08912 2.64629C8.06972 2.84038 8.20558 3.03447 8.39967 3.07329Z" fill="#2F363C"/>
                  <path d="M7.79799 5.42181C8.51613 5.48004 9.17604 5.79059 9.68068 6.29523C10.1853 6.79987 10.4959 7.45978 10.5541 8.17792C10.5735 8.37202 10.7288 8.50788 10.9229 8.50788C10.9423 8.50788 10.9423 8.50788 10.9617 8.50788C11.1558 8.48847 11.3111 8.31379 11.2916 8.1197C11.214 7.24628 10.8452 6.41168 10.2047 5.79059C9.58364 5.16949 8.74904 4.78131 7.87562 4.70367C7.68153 4.68426 7.50685 4.83954 7.48744 5.03363C7.46803 5.22772 7.60389 5.4024 7.79799 5.42181Z" fill="#2F363C"/>
                  <path d="M3.95493 12.021C5.13889 13.1855 6.45872 14.156 7.91441 14.9129C9.29246 15.6311 10.5152 15.9998 11.641 15.9998C11.8933 15.9998 12.1456 15.9804 12.3785 15.9416C12.9414 15.864 13.4849 15.6699 14.0089 15.3982C14.5135 15.1264 14.96 14.7577 15.3481 14.3306C15.8334 13.7872 16.0275 13.2243 15.9304 12.7003C15.8528 12.3315 15.6393 12.0015 15.3093 11.7298C15.0376 11.5163 14.7076 11.361 14.4165 11.2446C13.4654 10.8564 12.495 10.6041 11.6604 10.41C11.3693 10.3518 10.9617 10.2353 10.5541 10.3906C10.2435 10.507 10.0494 10.7399 9.87474 10.9534C9.81651 11.0311 9.73888 11.1087 9.68065 11.1864C9.52538 11.3416 9.09837 11.264 8.57432 10.9729C7.97264 10.6623 7.2545 10.0994 6.57517 9.42011C5.91526 8.7602 5.33298 8.02265 5.02243 7.42096C4.7313 6.89691 4.65366 6.46991 4.80893 6.31464C4.86716 6.25641 4.9448 6.19818 5.04184 6.12054C5.25534 5.94586 5.48826 5.75177 5.60471 5.44122C5.75998 5.03363 5.66294 4.60662 5.5853 4.3349C5.39121 3.5003 5.13889 2.52984 4.7507 1.57878C4.63425 1.26824 4.47898 0.95769 4.26547 0.68596C3.99374 0.356004 3.66379 0.123093 3.29501 0.0648652C2.79037 -0.032181 2.2275 0.161911 1.66464 0.647142C1.23763 1.01592 0.868858 1.46233 0.597129 1.98638C0.3254 2.51043 0.131307 3.03448 0.0536705 3.61675C-0.140422 4.93658 0.189535 6.39227 1.08236 8.08088C1.83932 9.51716 2.80978 10.8564 3.95493 12.021ZM0.752403 3.69439C0.888268 2.72393 1.39291 1.8117 2.13046 1.17119C2.40219 0.93828 2.79037 0.68596 3.15915 0.763597C3.35324 0.802416 3.54733 0.93828 3.70261 1.13237C3.85788 1.32647 3.95493 1.55938 4.07138 1.85051C4.42075 2.76275 4.67307 3.7138 4.86716 4.50958C4.92539 4.78131 4.98362 5.01422 4.90598 5.20831C4.86716 5.34417 4.71189 5.44122 4.55661 5.57709C4.45957 5.65472 4.36252 5.73236 4.26547 5.82941C4.1102 5.98468 3.93552 6.27582 3.99374 6.76105C4.03256 7.05219 4.14902 7.40155 4.36252 7.78974C4.71189 8.44965 5.31357 9.22602 6.05112 9.94416C6.78867 10.6623 7.54563 11.264 8.20555 11.6328C8.59373 11.8269 8.92369 11.9627 9.23424 12.0015C9.29246 12.0015 9.35069 12.021 9.40892 12.021C9.7777 12.021 10.03 11.8657 10.1659 11.7298C10.2629 11.6328 10.3406 11.5357 10.4182 11.4387C10.5541 11.2834 10.6511 11.1475 10.787 11.0893C10.9617 11.0117 11.214 11.0699 11.4857 11.1281C12.2815 11.3222 13.2325 11.5551 14.1448 11.9239C14.4359 12.0404 14.6688 12.1568 14.8629 12.2927C15.057 12.448 15.1929 12.642 15.2317 12.8361C15.3093 13.2049 15.0376 13.5931 14.8241 13.8648C14.1836 14.6024 13.2714 15.107 12.3009 15.2429C11.1363 15.4176 9.81651 15.107 8.26377 14.2918C6.86631 13.5543 5.60471 12.642 4.47898 11.5357C3.37265 10.41 2.46042 9.14838 1.72286 7.75092C0.888267 6.17877 0.57772 4.85894 0.752403 3.69439Z" fill="#2F363C"/>
                </svg>
                <div>${phone}</div>
              </div>
            `)}
          </div>
        ` : ''}
        ${(this.emails && this.emails.length > 0) ? html`
          <div class="contact-container">
            ${this.emails?.map((email) => html`
              <div class="email">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                  <path d="M485.743,85.333H26.257C11.815,85.333,0,97.148,0,111.589V400.41c0,14.44,11.815,26.257,26.257,26.257h459.487
                    c14.44,0,26.257-11.815,26.257-26.257V111.589C512,97.148,500.185,85.333,485.743,85.333z M475.89,105.024L271.104,258.626
                    c-3.682,2.802-9.334,4.555-15.105,4.529c-5.77,0.026-11.421-1.727-15.104-4.529L36.109,105.024H475.89z M366.5,268.761
                    l111.59,137.847c0.112,0.138,0.249,0.243,0.368,0.368H33.542c0.118-0.131,0.256-0.23,0.368-0.368L145.5,268.761
                    c3.419-4.227,2.771-10.424-1.464-13.851c-4.227-3.419-10.424-2.771-13.844,1.457l-110.5,136.501V117.332l209.394,157.046
                    c7.871,5.862,17.447,8.442,26.912,8.468c9.452-0.02,19.036-2.6,26.912-8.468l209.394-157.046v275.534L381.807,256.367
                    c-3.42-4.227-9.623-4.877-13.844-1.457C363.729,258.329,363.079,264.534,366.5,268.761z"></path>
                </svg>
                <div>${email}</div>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
      <p>Example event-based Profile Component v0.1.0</p>
    </div>
  `;

  }

}

export default ProfileComponent;
