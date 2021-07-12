import { ComponentEventTypes, ComponentOperationEvent, ComponentResponseEvent } from './component/models/component-events.model';

export const addListener = <T extends ComponentOperationEvent>(
  eventType: ComponentEventTypes,
  element: Node,
  process: (event: T) => Promise<ComponentResponseEvent>
): void => {

  element.addEventListener(eventType, async (event: T) => {

    const target = event.target;

    event.stopPropagation();

    if (!event || !event.detail || !event.detail.uri) {

      throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

    }

    target?.dispatchEvent(await process(event));

  });

};
