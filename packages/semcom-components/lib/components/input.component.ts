import { css, html, property } from 'lit-element';
import { ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import { BaseComponent } from './base.component';

export default class InputComponent extends BaseComponent {

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  handleResponse(event: ComponentResponseEvent): void {

    if (!event || !event.detail || !event.detail.data) {

      throw new Error('Argument event || !event.detail || !event.detail.quads should be set.');

    }

  }

  @property() localFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  @property() localEntry?: string;

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

        input[type=text], select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        button {
          width: 100%;
          background-color: #4CAF50;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button[type=submit]:hover {
          background-color: #45a049;
        }

      `,
    ];

  }

  fetcher = async () => {

    if(this.localFetch && this.localEntry) {

      const inputField = this.shadowRoot?.getElementById('inputField') as HTMLInputElement;
      const uri = this.localEntry.split('/profile')[0] + '/inputTest';
      await this.localFetch(uri, { method: 'PUT', body: inputField.value, headers: { 'content-type': 'text/plain' } });
      inputField.value = '';

    }

  };

  render() {

    return html`
    <div class="container">
      <label for="name">Your Input:</label>
      <br>
      <input type="text" id="inputField"/>
      <br>
      <button @click="${this.fetcher}" type="submit">Submit</button>
    </div>
  `;

  }

}
