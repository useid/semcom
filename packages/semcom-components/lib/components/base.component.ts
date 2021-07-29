/* eslint-disable no-console */
import { Component } from '@digita-ai/semcom-core';
import { ComponentAppendEvent, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import { LitElement, property } from 'lit-element';
import { Quad } from 'rdf-js';

declare global {
  interface HTMLElementEventMap {
    [ComponentEventTypes.READ]: ComponentReadEvent;
    [ComponentEventTypes.WRITE]: ComponentWriteEvent;
    [ComponentEventTypes.APPEND]: ComponentAppendEvent;
    [ComponentEventTypes.RESPONSE]: ComponentResponseEvent;
  }
}

/**
 * A base component which implements the Semcom-standard by using Lit.
 */
export abstract class BaseComponent extends LitElement implements Component {

  @property({ type: String }) entry?: string;

  /**
   * Instantiates a `BaseComponent`, and add an event listener to handle `ComponentResponseEvent`s.
   */
  constructor() {

    super();

    this.addEventListener(ComponentEventTypes.RESPONSE, this.handleResponse);

  }

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   */
  abstract handleResponse(event: ComponentResponseEvent): void;

  /**
   * Send a `ComponentReadEvent` to the component's parent to request data of a given resource.
   *
   * @param uri The uri of the resource to read.
   */
  readData(uri: string): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    this.dispatchEvent(new ComponentReadEvent({
      detail: { uri },
    }));

  }

  /**
   * Send a `ComponentWriteEvent` to the component's parent to write data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be written to the resource.
   */
  writeData(uri: string, data: Quad[]): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    if (!data) {

      throw new Error('Argument data should be set.');

    }

    this.dispatchEvent(new ComponentWriteEvent({
      detail: { uri, data },
    }));

  }

  /**
   * Send a `ComponentAppendEvent` to the component's parent to append data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be appended to the resource.
   */
  appendData(uri: string, data: Quad[]): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    if (!data) {

      throw new Error('Argument data should be set.');

    }

    this.dispatchEvent(new ComponentAppendEvent({
      detail: { uri, data },
    }));

  }

  /*
   * W3C Custom Element Specification (from MDN)
   */

  // Invoked each time the element is appended into a DOM (i.e. when node is added or moved).
  connectedCallback() {

    super.connectedCallback();
    console.debug(`[${this.tagName}] Element connected`);

  }

  // Invoked each time the element is disconnected from a DOM.
  disconnectedCallback() {

    super.disconnectedCallback();
    console.debug(`[${this.tagName}] Element disconnected`);

  }

  // Invoked each time the custom element is moved to a new DOM.
  adoptedCallback() {

    // super.adoptedCallback();
    console.debug(`[${this.tagName}] Element moved to other DOM`);

  }

  // Invoked each time one of the element's attributes specified in observedAttributes is changed.
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {

    super.attributeChangedCallback(name, oldValue, newValue);
    console.debug(`[${this.tagName}] Changed ${name} attribute from "${oldValue}" to "${newValue}"`);

  }

}

export default BaseComponent;
