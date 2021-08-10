import { ComponentDataTypes, ComponentAppendEvent, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-core';

declare global {
  interface GlobalEventHandlersEventMap {
    [ComponentEventTypes.READ]: ComponentReadEvent<any>;
    [ComponentEventTypes.WRITE]: ComponentWriteEvent<any>;
    [ComponentEventTypes.APPEND]: ComponentAppendEvent<any>;
    [ComponentEventTypes.RESPONSE]: ComponentResponseEvent<any>;
  }
}

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
