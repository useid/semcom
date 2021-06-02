import { ComponentData, Component } from '@digita-ai/semcom-core';
import { ComponentAppendEvent, ComponentEventType, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import { LitElement, property } from 'lit-element';

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

    this.addEventListener(ComponentEventType.RESPONSE, this.handleResponse);

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
  writeData(uri: string, data: ComponentData): void {

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
  appendData(uri: string, data: ComponentData): void {

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

}
