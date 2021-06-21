import { css, html, property, unsafeCSS, state } from 'lit-element';
import { RxLitElement } from 'rx-lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { Interpreter, State } from 'xstate';
import { DemoContext } from 'src/demo.machine';

export class ConnectComponent extends RxLitElement {

  @property({ type: Object })
  public actor: Interpreter<DemoContext>;

  @state()
  state?: State<DemoContext>;

  /**
   * Renders the component as HTML.
   *
   * @returns The rendered HTML of the component.
   */
  render() {

    return html`
      <div class="block">
        <figure class="logo">
          <img src="/assets/img/Digita-Blue-NoText.png">
        </figure>

        <h1 class="title has-text-dark">{{ 'connect.title' | translate }}</h1>

        </div>

        <div class="providers">

        <div *ngFor="let provider of providers$ | async">
          <div class="provider-button">
            <button (click)="connect(provider)">{{ provider.name }}</button>
          </div>
        </div>
    </div>
  `;

  }

  /**
   * The styles associated with the component.
   */
  static get styles() {

    return [
      css`
      :host {
        padding-top: 10%;
     }
      .logo {
        width: 12.5rem;
     }
      .title {
        font-weight: 300;
     }
      .providers {
        margin-top: 2rem;
     }
      .provider-button {
        margin: 0 !important;
        padding: 10px;
     }
      .provider-button > button {
        width: 200px;
        height: 40px;
        border-radius: 0;
     }
      
      `,
    ];

  }

}
