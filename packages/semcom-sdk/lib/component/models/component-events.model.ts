import { ComponentData } from '@digita-ai/semcom-core';

/**
 * Types of component events.
 */
export enum ComponentEventType {
  READ = 'semcom-data-read',
  WRITE = 'semcom-data-write',
  APPEND = 'semcom-data-append',
  RESPONSE = 'semcom-data-response',
}

/**
 * Payload of a `ComponentReadEvent`.
 */
export interface ComponentReadEventPayload {
  /**
   * The uri of the resource to which should be read.
   */
  uri: string;
}

/**
 * An event dispatched by a component  to read data from a given uri.
 */
export class ComponentReadEvent extends CustomEvent<ComponentReadEventPayload> {

  constructor(init: Partial<CustomEventInit<ComponentReadEventPayload>>) {

    super(ComponentEventType.READ, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}

/**
 * Payload of a `ComponentWriteEvent`.
 */
export interface ComponentWriteEventPayload {
  /**
   * The uri of the resource to which should be written.
   */
  uri: string;

  /**
   * The data which should be written to the resource.
   */
  data: ComponentData;
}

/**
 * AAn event dispatched by a component  to write data to a given uri.
 */
export class ComponentWriteEvent extends CustomEvent<ComponentWriteEventPayload> {

  constructor(init: Partial<CustomEventInit<ComponentWriteEventPayload>>) {

    super(ComponentEventType.WRITE, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}

/**
 * Payload of a `ComponentAppendEvent`.
 */
export interface ComponentAppendEventPayload {
  /**
   * The uri of the resource to which should be appended.
   */
  uri: string;

  /**
   * The data which should be appended to the resource.
   */
  data: ComponentData;
}

/**
 * An event dispatched by a component to append data to a given uri.
 */
export class ComponentAppendEvent extends CustomEvent<ComponentAppendEventPayload> {

  constructor(init: Partial<CustomEventInit<ComponentAppendEventPayload>>) {

    super(ComponentEventType.APPEND, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}

/**
 * A union type of all atomic operations a component can request.
 */
export type ComponentOperationEvent = ComponentReadEvent | ComponentWriteEvent | ComponentAppendEvent;

/**
 * Payload of a `ComponentResponseEvent`.
 */
export interface ComponentResponseEventPayload {
  /**
   * The uri on which the operation was performed.
   */
  uri: string;

  /**
   * The event which caused this response.
   */
  cause: ComponentOperationEvent;

  /**
   * The component's data after the operation.
   */
  data: ComponentData;

  /**
   * Indicates if the operation was successful.
   */
  success: boolean;
}

/**
 * An event dispatched by the component's parent in response to a `ComponentOperationEvent`.
 */
export class ComponentResponseEvent extends CustomEvent<ComponentResponseEventPayload> {

  constructor(init: Partial<CustomEventInit<ComponentResponseEventPayload>>) {

    super(ComponentEventType.RESPONSE, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}
