import { LitElement, css, html, internalProperty } from 'lit-element';
import type { Component } from '@digita-ai/semcom-core';
import DataFactory from 'rdf-ext';
import type { DatasetIndexed } from 'rdf-dataset-indexed/dataset';

// import confetti from 'https://cdn.skypack.dev/canvas-confetti';
// confetti();
export class PayslipComponent extends LitElement implements Component {

  // required by semcom, but would leave it out
  metadata = {
    uri: 'http://example.org/payslipComponent',
    label: 'SemCom Payslip Component',
    description: 'Digita SemCom component for payslip information',
    tag: 'payslip',
    author: 'Digita',
    version: '0.2.1',
    latest: true
  }

  @internalProperty()
  name: string | undefined = 'Wouter';

  set rdfData(dataset: DatasetIndexed) {
    this.name = dataset.filter(
      quad => quad.predicate.equals(DataFactory.namedNode('http://example.org/predicate'))
    ).toArray()[0].object.value;
    console.log('data-update');
  }

  static get styles() {
    return [
      css`
        :host {
          font-variant: small-caps;
        }
      `
    ];
  }

  render() { return html`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css" />
    <div class='hero'>
      <div class='container'>
        <h1>Paid: ${this.name}</h1>
      </div>
    </div>
  `;}

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
