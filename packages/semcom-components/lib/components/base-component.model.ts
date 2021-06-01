import { Component } from '@digita-ai/semcom-core';
import { LitElement } from 'lit-element';
import { AppendEvent, BaseComponentEvent, ReadEvent, ResponseEvent, WriteEvent } from './base-component-events.model';

export abstract class BaseComponent extends LitElement implements Component {

  constructor() {

    super();

    this.addEventListener(BaseComponentEvent.RESPONSE, this.handleResponse);

  }

  abstract handleResponse(event: ResponseEvent): void;

  read(uri: string): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    this.dispatchEvent(new ReadEvent({
      detail: { uri },
      bubbles: true,
      composed: true,
    }));

  }

  write(uri: string): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    this.dispatchEvent(new WriteEvent({
      detail: { uri },
      bubbles: true,
      composed: true,
    }));

  }

  append(uri: string): void {

    if (!uri) {

      throw new Error('Argument uri should be set.');

    }

    this.dispatchEvent(new AppendEvent({
      detail: { uri },
      bubbles: true,
      composed: true,
    }));

  }

}
