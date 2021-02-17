import { html, render } from 'lit-html';
import { Component } from '../../semcom-core/dist/public-api';

export class ProfileComponent extends HTMLElement implements Component {

  metadata = {
    uri: 'string',
    name: 'SemCom Profile Component',
    label: 'Digita SemCom component for profile information',
    author: 'Digita',
    version: '0.2.1',
    latest: true
  }

  // template = function from data to TemplateResult object
  template = (name: string) => html`
    <h1>Hello ${name}</h1>
  `;

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  setData(data: any): void {
    console.log(data);
    render(this.template(data), this.shadowRoot || this );
  }

}
