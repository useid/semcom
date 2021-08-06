import { ComponentDataTypes } from '@digita-ai/semcom-core';
import { ComponentEventTypes, ComponentOperationEvent, ComponentResponseEvent } from './component/models/component-events.model';

export const addListener = <T extends ComponentOperationEvent, D extends keyof ComponentDataTypes>(
  eventType: ComponentEventTypes,
  element: Node,
  type: D,
  process: (event: T) => Promise<ComponentResponseEvent<D>>,
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
