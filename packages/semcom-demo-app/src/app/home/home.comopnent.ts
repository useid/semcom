import { css, html, unsafeCSS } from 'lit-element';
import { RxLitElement } from 'rx-lit';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';

export class HometComponent extends RxLitElement {


  /**
   * Renders the component as HTML.
   *
   * @returns The rendered HTML of the component.
   */
  render() {

    return html`
    <div class="block">
        <div #components></div>
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
      `,
    ];

  }

}
