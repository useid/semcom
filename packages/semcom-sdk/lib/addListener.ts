import { ComponentDataTypes } from '@digita-ai/semcom-core';
import { ComponentAppendEvent, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from './component/models/component-events.model';

declare global {
  interface GlobalEventHandlersEventMap<D extends keyof ComponentDataTypes> {
    [ComponentEventTypes.READ]: ComponentReadEvent;
    [ComponentEventTypes.WRITE]: ComponentWriteEvent<D>;
    [ComponentEventTypes.APPEND]: ComponentAppendEvent<D>;
    [ComponentEventTypes.RESPONSE]: ComponentResponseEvent<D>;
  }
}

export const addListener = <D extends keyof ComponentDataTypes, T extends ComponentEventTypes>(
  eventType: T,
  element: GlobalEventHandlers,
  type: D,
  process: (event: GlobalEventHandlersEventMap<D>[T]) => Promise<ComponentResponseEvent<D>>
): void => {

  element.addEventListener<T>(eventType, async (event: GlobalEventHandlersEventMap<D>[T]) => {

    const target = event.target;

    event.stopPropagation();

    if (!event || !event.detail || !event.detail.uri) {

      throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

    }

    target?.dispatchEvent(await process(event));

  });

};
