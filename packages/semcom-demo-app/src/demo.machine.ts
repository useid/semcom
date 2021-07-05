import { ComponentMetadata } from '@digita-ai/semcom-core';
import { Session } from '@digita-ai/ui-transfer-components';
import { Observable, of, forkJoin } from 'rxjs';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import { EventObject, MachineConfig, assign, StateSchema } from 'xstate';
import { SemComService } from './services/semcom.service';

/* CONTEXT */

export interface DemoContext {
  components?: ComponentMetadata[];
  session?: Session;
  semComService: SemComService;
  shapeIds?: string[];
  tags?: string[];
}

export interface WithSession extends DemoContext {
  session: Session;
}
export interface WithShapeIds extends DemoContext {
  shapeIds: string[];
}
export interface WithComponents extends DemoContext {
  components: ComponentMetadata[];
}

/* STATES */

export enum DemoStates {
  AUTHENTICATING = '[DemoState: Authenticating]',
  DETECTING_SHAPES = '[DemoState: Detecting shapes]',
  QUERYING_METADATA = '[DemoState: Querying metadata]',
  REGISTER_COMPONENTS = '[DemoState: Register components]',
  IDLE = '[DemoState: Idle]',
}

export type DemoState =
  {
    value: DemoStates.AUTHENTICATING | DemoStates.QUERYING_METADATA | DemoStates.REGISTER_COMPONENTS | DemoStates.IDLE;
    context: DemoContext;
  } | {
    value: DemoStates.DETECTING_SHAPES;
    context: DemoContext & WithSession & WithShapeIds;
  };

export interface DemoStateSchema extends StateSchema<DemoContext> {
  states: {
    [key in DemoStates]?: StateSchema<DemoContext>;
  };
}

/* EVENTS */

export enum DemoEvents {
  AUTHENTICATED = '[DemoEvent: Authenticated]',
  HOME_PAGE_INIT = '[Home] Home Page Initialized',
  HOME_PAGE_ERROR = '[Home] Home Page Error',
  SHAPES_DETECTED = '[Home] Data Shapes Detected',
  COMPONENTS_SELECTED = '[Home] Components Selected',
  COMPONENTS_REGISTERED = '[Home] Components Registered',
}

export class AuthenticatedEvent implements EventObject {

  public type: DemoEvents.AUTHENTICATED = DemoEvents.AUTHENTICATED;
  constructor(public session: Session) {}

}

export class HomePageInitEvent implements EventObject {

  public type: DemoEvents.HOME_PAGE_INIT = DemoEvents.HOME_PAGE_INIT;

}

export class HomePageErrorEvent implements EventObject {

  public type: DemoEvents.HOME_PAGE_ERROR = DemoEvents.HOME_PAGE_ERROR;

}

export class ShapesDetectedEvent implements EventObject {

  public type: DemoEvents.SHAPES_DETECTED = DemoEvents.SHAPES_DETECTED;
  constructor(public shapeIds: string[]) {}

}

export class ComponentsSelectedEvent implements EventObject {

  public type: DemoEvents.COMPONENTS_SELECTED = DemoEvents.COMPONENTS_SELECTED;
  constructor(public components: ComponentMetadata[]) {}

}

export class ComponentsRegisteredEvent implements EventObject {

  public type: DemoEvents.COMPONENTS_REGISTERED = DemoEvents.COMPONENTS_REGISTERED;

}

export type DemoEvent =
  | AuthenticatedEvent
  | HomePageInitEvent
  | HomePageErrorEvent
  | ShapesDetectedEvent
  | ComponentsSelectedEvent
  | ComponentsRegisteredEvent;

/* SERVICES */

const detectShapes = (
  context: DemoContext,
  event: DemoEvent,
): Observable<ShapesDetectedEvent> => {

  if (!context.session) {

    throw Error('Parameter session should be set');

  }

  return of(context.session.webId).pipe(
    mergeMap((webId) => context.semComService.detectShapes(webId)),
    map((shapeIds) => new ShapesDetectedEvent(shapeIds)),
  );

};

const queryMetadataFromShapes = (
  context: DemoContext
): Observable<ComponentsSelectedEvent> => {

  if (!context.shapeIds) {

    throw Error('Parameter shapeIds should be set');

  }

  return of(context.shapeIds).pipe(
    map((shapeIds) => shapeIds.concat([ 'http://digita.ai/voc/input#input' ])),
    mergeMap((shapeIds) => forkJoin(shapeIds.map((shapeId) => context.semComService.queryComponents(shapeId)))),
    map((resultsPerShape) => resultsPerShape.filter((results) => results.length > 0)),
    map((resultsPerShape) => resultsPerShape.map((results) => results[0])),
    map((components) => new ComponentsSelectedEvent(components))
  );

};

const registerComponentsFromMetadata = (
  context: DemoContext
): Observable<ComponentsRegisteredEvent> => {

  if (!context.components) {

    throw Error('Parameter components should be set');

  }

  return of(context.components).pipe(
    mergeMap((components) => forkJoin(
      components.map(async (metadata) => {

        // eslint-disable-next-line no-eval
        const elementComponent = await eval(`import("${metadata.uri}")`);
        const ctor = customElements.get(metadata.tag) || customElements.define('demo-' + metadata.tag, elementComponent.default);

      }),
    )),
    mapTo(new ComponentsRegisteredEvent()),
  );

};

/* MACHINE */

export const demoMachine: MachineConfig<DemoContext, DemoStateSchema, DemoEvent> = {

  initial: DemoStates.AUTHENTICATING,

  states: {

    [DemoStates.AUTHENTICATING]: {
      on: {
        [DemoEvents.AUTHENTICATED]: {
          actions:  assign({ session: (context, event) => event.session }),
          target: DemoStates.DETECTING_SHAPES,
        },
      },
    },

    [DemoStates.DETECTING_SHAPES]: {
      invoke: {
        src: detectShapes,
      },
      on: {
        [DemoEvents.SHAPES_DETECTED]: {
          actions: assign({ shapeIds: (context, event) => event.shapeIds }),
          target: DemoStates.QUERYING_METADATA,
        },
      },
    },

    [DemoStates.QUERYING_METADATA]: {
      invoke: {
        src: queryMetadataFromShapes,
      },
      on: {
        [DemoEvents.COMPONENTS_SELECTED]: {
          actions: assign({ components: (context, event) => event.components }),
          target: DemoStates.REGISTER_COMPONENTS,
        },

      },
    },

    [DemoStates.REGISTER_COMPONENTS]: {
      invoke: {
        src: registerComponentsFromMetadata,
      },
      on: {
        [DemoEvents.COMPONENTS_REGISTERED]: {
          target: DemoStates.IDLE,
        },
      },
    },

    [DemoStates.IDLE]: {
      type: 'final',
    },
  },

};
