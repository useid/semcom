/* eslint-disable no-console */
import { Component, ComponentDataTypes } from '@digita-ai/semcom-core';
import { ComponentAppendEvent, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import { property } from 'lit-element';
import { RxLitElement } from 'rx-lit';

/**
 * A base component which implements the Semcom-standard by using Lit.
 */
export abstract class BaseComponent extends RxLitElement implements Component {

  @property({ type: String }) entry?: string;

  /**
   * Instantiates a `BaseComponent`, and adds an event listener to handle `ComponentResponseEvent`s.
   */
  constructor() {

    super();

    this.addEventListener(ComponentEventTypes.RESPONSE, this.handleResponse);

  }

  /**
   * Handles a response event. Can be used to update the component's properties based on the data in the response.
   *
   * @param event The response event to handle.
   * @param type The type of data to handle.
   */
  abstract handleResponse<D extends keyof ComponentDataTypes>(event: ComponentResponseEvent<D>): void;

  /**
   * Send a `ComponentReadEvent` to the component's parent to request data of a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param type The type of data to read.
   */
  readData<D extends keyof ComponentDataTypes>(uri: string, type: D, mime?: string): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    this.dispatchEvent(new ComponentReadEvent({
      detail: { uri, type, mime },
    }));

  }

  /**
   * Send a `ComponentWriteEvent` to the component's parent to write data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be written to the resource.
   */
  writeData<D extends keyof ComponentDataTypes>(uri: string, data: ComponentDataTypes[D], type: D): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    if (!data) {

      throw new Error('Argument data should be set.');

    }

    this.dispatchEvent(new ComponentWriteEvent({
      detail: { uri, data, type },
    }));

  }

  /**
   * Send a `ComponentAppendEvent` to the component's parent to append data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be appended to the resource.
   */
  appendData<D extends keyof ComponentDataTypes>(uri: string, data: ComponentDataTypes[D], type: D): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    if (!data) {

      throw new Error('Argument data should be set.');

    }

    this.dispatchEvent(new ComponentAppendEvent({
      detail: { uri, data, type },
    }));

  }

  /*
   * W3C Custom Element Specification (from MDN)
   */

  // Invoked each time the element is appended into a DOM (i.e. when node is added or moved).
  connectedCallback(): void {

    super.connectedCallback();
    console.debug(`[${this.tagName}] Element connected`);

  }

  // Invoked each time the element is disconnected from a DOM.
  disconnectedCallback(): void {

    super.disconnectedCallback();
    console.debug(`[${this.tagName}] Element disconnected`);

  }

  // Invoked each time the custom element is moved to a new DOM.
  adoptedCallback(): void {

    // super.adoptedCallback();
    console.debug(`[${this.tagName}] Element moved to other DOM`);

  }

  // Invoked each time one of the element's attributes specified in observedAttributes is changed.
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {

    super.attributeChangedCallback(name, oldValue, newValue);
    console.debug(`[${this.tagName}] Changed ${name} attribute from "${oldValue}" to "${newValue}"`);

  }

}

export default BaseComponent;
