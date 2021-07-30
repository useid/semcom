import { ComponentAppendEvent, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from './component/models/component-events.model';

declare global {
  interface GlobalEventHandlersEventMap {
    [ComponentEventTypes.READ]: ComponentReadEvent;
    [ComponentEventTypes.WRITE]: ComponentWriteEvent;
    [ComponentEventTypes.APPEND]: ComponentAppendEvent;
    [ComponentEventTypes.RESPONSE]: ComponentResponseEvent;
  }
}

export const addListener = <T extends ComponentEventTypes>(
  eventType: T,
  element: GlobalEventHandlers,
  process: (event: GlobalEventHandlersEventMap[T]) => Promise<ComponentResponseEvent>
): void => {

  element.addEventListener<T>(eventType, async (event: GlobalEventHandlersEventMap[T]) => {

    const target = event.target;

    event.stopPropagation();

    if (!event || !event.detail || !event.detail.uri) {

      throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

    }

    target?.dispatchEvent(await process(event));

  });

};
