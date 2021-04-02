import * as N3 from 'n3';
import { LitElement, css, html, property } from 'lit-element';
import type { Component } from '@digita-ai/semcom-core';

// import confetti from 'https://cdn.skypack.dev/canvas-confetti';
// confetti();

export default class PayslipComponent extends LitElement implements Component {

  data (
    entry: string,
    customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  ): Promise<void> {

    const myFetch = customFetch ? customFetch : fetch;
    const parser = new N3.Parser();
    const store = new N3.Store();

    const paidUri = new N3.NamedNode('http://example.org/paid');

    return myFetch(entry)
      .then((response) => response.text())
      .then((text) => { console.log(text);
        store.addQuads(parser.parse(text));
        const amountTriple =  store.getQuads(null, paidUri, null, null)[0];
        const amount = amountTriple ? parseFloat(amountTriple.object.value) : undefined;
        this.paid = amount ? amount : undefined;
      });

  }

  @property({ type: Number }) paid?: number;

  render() { return html`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css" />
    <div class='hero'>
      <div class='container'>
        <h1>Paid: €${ this.paid ? this.paid : 0 }</h1>
      </div>
    </div>
  `;}

  static get styles() {
    return [
      css`
        :host {
          font-variant: small-caps;
        }
      `
    ];
  }

  /*
   * W3C Custom Element Specification (from MDN)
   */

  // Invoked each time the element is appended into a DOM (i.e. when node is added or moved).
  connectedCallback() {
    super.connectedCallback();
    console.log('[CElem] element connected');
  }

  // Invoked each time the element is disconnected from a DOM.
  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('[CElem] element disconnected');
  }

  // Invoked each time the custom element is moved to a new DOM.
  adoptedCallback() {
    //super.adoptedCallback();
    console.log('[CElem] element moved to other DOM');
  }

  // Invoked each time one of the element's attributes specified in observedAttributes is changed.
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    console.log(`[CElem] changed ${name} attribute from "${oldValue}" to "${newValue}"`);
  }

}
