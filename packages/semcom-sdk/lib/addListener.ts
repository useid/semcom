import { ComponentDataTypes } from '@digita-ai/semcom-core';
import { ComponentAppendEvent, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from './component/models/component-events.model';

/**
 * Global interface representing a global event handlers event map.
 * With READ, WRITE, APPEND and RESPONSE keys.
 */
declare global {
  interface GlobalEventHandlersEventMap {
    [ComponentEventTypes.READ]: ComponentReadEvent<any>;
    [ComponentEventTypes.WRITE]: ComponentWriteEvent<any>;
    [ComponentEventTypes.APPEND]: ComponentAppendEvent<any>;
    [ComponentEventTypes.RESPONSE]: ComponentResponseEvent<any>;
  }
}

/**
 * Adds listeners to a type of event.
 *
 * @param { T } eventType - The type of event to listen to.
 * @param { D } dataType -The type of data to listen to.
 * @param { GlobalEventHandlers} element - The element on which the event should occur.
 * @param { (event: GlobalEventHandlersEventMap[T]) } process - The function to call when the event occurs.
 */
export const addListener = <D extends keyof ComponentDataTypes, T extends ComponentEventTypes>(
  eventType: T,
  dataType: D,
  element: GlobalEventHandlers,
  process: (event: GlobalEventHandlersEventMap[T]) => Promise<ComponentResponseEvent<D>>
): void => {

  element.addEventListener<T>(eventType, async (event: GlobalEventHandlersEventMap[T]) => {

    const target = event.target;

    event.stopPropagation();

    if (!event || !event.detail || !event.detail.uri) {

      throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

    }

    if (event.detail.type !== dataType) {

      throw new Error('Invalid response type.');

    }

    target?.dispatchEvent(await process(event));

  });

};
