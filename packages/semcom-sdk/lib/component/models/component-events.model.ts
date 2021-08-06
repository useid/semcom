import { ComponentDataTypes } from '@digita-ai/semcom-core';

/**
 * Types of component events.
 */
export enum ComponentEventTypes {
  READ = 'semcom-data-read',
  WRITE = 'semcom-data-write',
  APPEND = 'semcom-data-append',
  RESPONSE = 'semcom-data-response',
}

export type ComponentEventType = keyof typeof ComponentEventTypes;

/**
 * Payload of a `ComponentReadEvent`.
 */
export interface ComponentReadEventPayload {
  /**
   * The uri of the resource to which should be read.
   */
  uri: string;

  /**
   * The type of data.
   */
  type: keyof ComponentDataTypes;

  /**
   * The mime type of the data.
   */
  mime?: string;
}

/**
 * An event dispatched by a component  to read data from a given uri.
 */
export class ComponentReadEvent extends CustomEvent<ComponentReadEventPayload> {

  constructor(init: Partial<CustomEventInit<ComponentReadEventPayload>>) {

    super(ComponentEventTypes.READ, {
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
export interface ComponentWriteEventPayload<D extends keyof ComponentDataTypes> {
  /**
   * The uri of the resource to which should be written.
   */
  uri: string;

  /**
   * The type of the data to be written.
   */
  type: D;

  /**
   * The data which should be written to the resource.
   */
  data: ComponentDataTypes[D];
}

/**
 * An event dispatched by a component  to write data to a given uri.
 */
export class ComponentWriteEvent<D extends keyof ComponentDataTypes>
  extends CustomEvent<ComponentWriteEventPayload<D>> {

  constructor(init: Partial<CustomEventInit<ComponentWriteEventPayload<D>>>) {

    super(ComponentEventTypes.WRITE, {
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
export interface ComponentAppendEventPayload<D extends keyof ComponentDataTypes> {
  /**
   * The uri of the resource to which should be appended.
   */
  uri: string;

  /**
   * The type of the data to be appended.
   */
  type: D;

  /**
   * The data which should be appended to the resource.
   */
  data: ComponentDataTypes[D];
}

/**
 * An event dispatched by a component to append data to a given uri.
 */
export class ComponentAppendEvent<D extends keyof ComponentDataTypes>
  extends CustomEvent<ComponentAppendEventPayload<D>> {

  constructor(init: Partial<CustomEventInit<ComponentAppendEventPayload<D>>>) {

    super(ComponentEventTypes.APPEND, {
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
export type ComponentOperationEvent = ComponentReadEvent
| ComponentWriteEvent<keyof ComponentDataTypes>
| ComponentAppendEvent<keyof ComponentDataTypes>;

/**
 * Payload of a `ComponentResponseEvent`.
 */
export interface ComponentResponseEventPayload<D extends keyof ComponentDataTypes> {
  /**
   * The uri on which the operation was performed.
   */
  uri: string;

  /**
   * The event which caused this response.
   */
  cause: ComponentOperationEvent;

  /**
   * The type of the data.
   */
  type: D;

  /**
   * The component's data after the operation.
   */
  data: ComponentDataTypes[D];

  /**
   * Indicates if the operation was successful.
   */
  success: boolean;
}

/**
 * An event dispatched by the component's parent in response to a `ComponentOperationEvent`.
 */
export class ComponentResponseEvent<D extends keyof ComponentDataTypes> extends
  CustomEvent<ComponentResponseEventPayload<D>> {

  constructor(init: Partial<CustomEventInit<ComponentResponseEventPayload<D>>>) {

    super(ComponentEventTypes.RESPONSE, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}
