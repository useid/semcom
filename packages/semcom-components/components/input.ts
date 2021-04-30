/* eslint-disable no-console -- is a web component */
import * as N3 from 'n3';
import { LitElement, css, html, property } from 'lit-element';
import type { Component } from '@digita-ai/semcom-core';

export default class InputComponent extends LitElement implements Component {

  data (
    entry: string,
    customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  ): Promise<void> {

    const myFetch = customFetch ? customFetch : fetch;
    const parser = new N3.Parser();
    const store = new N3.Store();

    this.localFetch = myFetch;
    this.localEntry = entry;

    return myFetch(entry)
      .then((response) => response.text())
      .then((text) => {
        store.addQuads(parser.parse(text));
      });

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
      await this.localFetch(uri, { method: 'PUT', body: inputField.value, headers: {'content-type': 'text/plain'} });
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

  /*
   * W3C Custom Element Specification (from MDN)
   */

  // Invoked each time the element is appended into a DOM (i.e. when node is added or moved).
  connectedCallback() {
    super.connectedCallback();
    console.info('[DGT-InputComponent] Element connected');
  }

  // Invoked each time the element is disconnected from a DOM.
  disconnectedCallback() {
    super.disconnectedCallback();
    console.info('[DGT-InputComponent] Element disconnected');
  }
  // Invoked each time the custom element is moved to a new DOM.
  adoptedCallback() {
    // super.adoptedCallback();
    console.info('[DGT-InputComponent] Element moved to other DOM');
  }

  // Invoked each time one of the element's attributes specified in observedAttributes is changed.
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    console.info(`[DGT-InputComponent] Changed ${name} attribute from "${oldValue}" to "${newValue}"`);
  }

}
