import { SolidDataset } from '@inrupt/solid-client';
import { Observable, of } from 'rxjs';
import { EventObject, MachineConfig, assign, StateSchema } from 'xstate';
import { Provider } from './app/models/provider.model';

/* CONTEXT */

export interface DemoContext {
  sources?: Provider[];
  profile?: SolidDataset | null;
  components?: string[];
}

export interface WithSources extends DemoContext {
  sources: Provider[];
}

/* STATES */

export enum DemoStates {
  AUTHENTICATING = '[DemoState: Authenticating]',
  LOADING_SOURCES = '[DemoState: Loading sources]',
  AWAITING_SOURCE_SELECTION = '[DemoState: Awaiting source selection]',
  CONNECTING = '[DemoState: Connecting]',
  CALLBACK = '[DemoState: Callback]',
}

export type DemoState =
  {
    value: DemoStates.AUTHENTICATING;
    context: DemoContext;
  } | {
    value: DemoStates.LOADING_SOURCES;
    context: DemoContext;
  } | {
    value: DemoStates.AWAITING_SOURCE_SELECTION | DemoStates.CONNECTING | DemoStates.CALLBACK;
    context: DemoContext & WithSources;
  };

export interface DemoStateSchema extends StateSchema<DemoContext> {
  states: {
    [key in DemoStates]?: StateSchema<DemoContext>;
  };
}

/* EVENTS */

export enum DemoEvents {
  AUTHENTICATED = '[DemoEvent: Authenticated]',
  INVITE_LOADED = '[DemoEvent: Invite loaded]',
  SOURCES_LOADED = '[DemoEvent: Sources loaded]',
  CONSENT_GIVEN = '[DemoEvent: Consent given]',
  SOURCE_SELECTED = '[DemoEvent: Source selected]',
  CONNECTED = '[DemoEvent: Invite connected to source]',
}

export class AuthenticatedEvent implements EventObject {

  public type: DemoEvents.AUTHENTICATED = DemoEvents.AUTHENTICATED;

  constructor(public session: Session) {}

}

export class InviteLoadedEvent implements EventObject {

  public type: DemoEvents.INVITE_LOADED = DemoEvents.INVITE_LOADED;
  constructor(public invite: Invite, public holder: Holder, public purpose: Purpose) {}

}

export class ConsentGivenEvent implements EventObject {

  public type: DemoEvents.CONSENT_GIVEN = DemoEvents.CONSENT_GIVEN;

}

export class SourcesLoadedEvent implements EventObject {

  public type: DemoEvents.SOURCES_LOADED = DemoEvents.SOURCES_LOADED;
  constructor(public sources: Source[]) {}

}

export class SourceSelectedEvent implements EventObject {

  public type: DemoEvents.SOURCE_SELECTED = DemoEvents.SOURCE_SELECTED;
  constructor(public source: Source) {}

}

export class ConnectedEvent implements EventObject {

  public type: DemoEvents.CONNECTED = DemoEvents.CONNECTED;

}

export type DemoEvent =
  | AuthenticatedEvent
  | InviteLoadedEvent
  | ConsentGivenEvent
  | SourcesLoadedEvent
  | SourceSelectedEvent
  | ConnectedEvent;

/* SERVICES */

const loadInvite = (context: DemoContext): Observable<InviteLoadedEvent> => of(new InviteLoadedEvent(
  {
    uri: 'http://consent.eu/invites/98347576',
    holder: 'http://consent.eu/holders/07802652',
    purpose: 'http://consent.eu/purposes/38760520',
  } as Invite,
  {
    uri: 'http://consent.eu/holders/07802652',
  } as Holder,
  {
    uri: 'http://consent.eu/purposes/38760520',
    icon: 'data:image/png;base64,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',
    description: 'This source will be used to get your data',
    predicates: [
      'http://xmlns.com/foaf/0.1/name',
      'http://digita.ai/voc/events#event',
    ],
  } as Purpose
));

const loadSources = (context: DemoContext): Observable<SourcesLoadedEvent> => of(new SourcesLoadedEvent([ {
  uri: '1',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAsVBMVEX///98Tf/39/dzPf90P/96Sv/BwcHWyv/7/Pfj2v9xOf+MZf76+vq9vb11Qf93RP/+//bh2fm5pvvr6+va2tqgg/20n/twN/+3sM3d1Pn8+//Htv/28//Txv+BVP+Qa/+tk//r5f/Arf+JYP/LvP/v6v+ef/+EWf/Nzc318v+Wc//u6f/az/+lif/w7ffe1f+aef+xmf+qkP/LvfqUcP+6qPvY1t2xqMzb1PG9u8Lh4eFS45noAAAJrklEQVR4nO2diVbjOBBFO7HVGOOWHbbMJCwdIKxhTTNL//+HjRMTesGWXpVKls8cvw8ALlVW2aVaPn3q1atXr169evXq1atXr169hDSZj7blNbuZhAZb6256eaXTyIdSdf51KzDl5OJqrJUa+JLK4/HldkDA5SD2R7dRnj7NA/HdnEb++VZS490ggAvdDt9K8W2Ax3E6bo2vVH5y8/8GLD11cNQu4FbLgCXieauAN2nbgKWjHrRJeNreIfND6XF7gBdRAMDSiu0dqB7fYoyEX9sCPMyDAA4G41k7gPMwPlpK3bZD+BTKhOVhs9UG4GOASLGROmmD8DzMMVNJn/kHnAZ7CteKvb+8TUJasFR+75vwOdwxUykd+QW8a/2N+3epHb+Et4GdtFTk9fV0ETBSbKQGPglPwpuwjBiH/gDP4tB0a429ZTSOQp+jb/L3LfzSEcJB6ilJPOvAMVPJV87mWxeOmUrRhQ/Arc6YsDSi8pHQ6ESk2Ch/lgd81aGpflF0Jw141I1Q+C71JE1435VIsVG6kAUcdeiYqaSuZAl3unTMVIqnkoDHYVMX9dKCEWMy6J4Jy4jxIkd42K1IsVEklgK/CZ66qJc6lSI8IEcKxRP110ilwGlJbpXHqb7a4eh8kMY5BVMqBU5Icqs4v91dPGQJUw9bh+cRwWP0qwQgfh2ap7fHD0WSDNkq/zXF6CDF/6WRQAp8gj4eKj6YFQ50GyXF7Bv8EiyRAkeT3NHtrMjc+SrGKfzou6fA59jvUnopxbdSMUJPHPcUOHYdmp/PBfzzJyUzFDFaugFikUI/ZbKAJeIIPOBcU+BXyH9S30vzlSrQM9wtBT5FDrX8sqj9G/ccEdFXqcghBT5B3rjVaYMFs/09l8MnewDf9/NLPuFX5L+YPzRxZPv7LogFWrczZqfAoSR3utX8EGb71w6EQ9SI/BQ4kuTOD+ofwg3iZwdPLS7RiMFMgUNJ7mYffUP88p2NmByjX97MhAYSKfJDkwkrRL6nPqAvb7wUOHQdmj7Y/soSke2pCRSO138HIwUOJbnzF4sJK0SupxZPKCGnpg+6Do3+BN5mVog8T02gcLUWPQUORQp1Bb2urRyV5akJXslKT4FDldz5s91JN4hfGNE/2cUzGtQUOJbk1oZo/xGR7qkUQmrEwJLc6Ry1y9pRyZ5KIqRVge9ioVbjX01rRKqnkghJVeA3GKDaIXwXVojXQwojjVB9wwnBLzPV8GFoQKR5Ko2QUNO3Dd5TKONbdwMixVOJhHhCA70OJRJuEHFPJRIONNiJuUST3DQvfUfEPZVKONBYQgPOqasrIuEGEfVUMiFW00fo+bF/WTQhYp5KJhyMgRT4DaFwRk/JacSNo0KeSidEUuCUnh91Qk+UbhART6UTAilw2nWotn3imxDtnsogVMpGSOz5GS/4VrR7KoPQmgInd4dq5Bu4CdHmqckro9YsMk5gmNC9Ih65WLH01GYlBaeazpwCZ/T8KJYV//r7jzf9M2rWGauOJ31sBgSvQ39HZFgxeR7nlWLD+BZePaQpBQ6ntn79iTHDisWhv1K5qDGhwe35YVnRJ2JjFTicf/3wE6GsYnuIeUPEcCixZB03HhGjeiO6VMmqqFOOWt8u7NYS0y0r1h+nnPeHn38oJ/R7Q0zr8m6u80o6ZUVdFzCcy2S7FDTq6t0EOtM6FPrrHsRHgV/UIUfVHwmPJdp+VNoVxPFHwqVIPX5nrFhDKGLD7lixhnAh9Es6YsW85iyV+h2dOFFrs4pibSNdsGJtx5DcZJ0OIOq6OjDBCV7hHbU24bYt2EQZ2ooNyX32J37drwgbNGpfvMGSZ1RhrdhUeSLaRxnSio13wbK9sOGsaJi4IDu0M9iJaigZnsk2iwayovGWVHgCTRhE4/SaI+GW5hCOaqlWkJ4EFcCKthYaybC/UutBw1o1JD5np2Ur2u/xaVP1tM5NWv8oFT22iAhU71G+hPXS/HdeV5fZ/zJqvItDljNBQwjwm271ZG8nqSoSWkOEqmihlryK0FqbmO195iO+0h0VbO2GvzGA6stseM1HfCZHZw2256P5DKi+dFOrx0BMqIkVeMrwo2iNcPadVlT6EyExh0toegar98Aa4beHkWHFjGbDCB91Ak5dx6ugr8lF7GvhnV3rP4dQqw/m3XDCtwpvckcJqUar9t63Sdi4D0Il+5unEhE99sxgNYqUWv0qbBCtSOhdo2+/QEpPaN0I2ephpCEmhC9y8vg2pKuE2lHynYoIN3OzRvABnUHkjpI9oqMSQr6p5LJBwDogKuGwChsERPjNlLXbw96hxyBct1rCLTN/woTm0ucmWVPgDMLKU0FEPFgwR9JaU+AcwjJsfP4CWrGAM9Q1d9qQbBGDRThcPYwQYjZHX7zZo6FtY1mt3/hNf/p3CBF2Uofx3pZmAHXKI1w9jABigt6F8efTfDqyPIk5k3D1DmdFTJagk7rMGLKlwPFu9Y+M+1ZEdIB47LQqwfxb9JI/5Kt8GI2IBdgx77ruwtygwD1qKsShKS4m6EYb55Ul5hS4Nk8Ysum6GTFB6+pdZ+5ZCmutI4bMap53VrygU7DcVweZR8TE5E7gXxH36sfWFfBmMIH1T+aGvfzeyYgNKi7gAVESK7zMKfDI4ThtBMTHl0rMoLVdmuqZNGKxCwOiQxQsMjc/KyU7ujQZXsKZbrF1iOa8rFIjuWcxKxYnhIkHUgvK5ubgq9KpxITk4WqA8OiWMAhabia79dI0Ph25M2arQdekffSkJLdZ1hS4Sp8WGXuSd7Ya453Mzs4J9hvI7kYAUuAqGtwvR6z4/zCfbZ3dn0SkgfOlYtGNSEDiUuU6SnmK4pyKVwLKLl2VLJGWkfSeGcYGCM+S3hX06aZjm2bk9z11bROLYKR4V6e26fjYu9atjUheducJV4E7SXab1bu6s5lMPFJs1JntcozrUEzSVeBcOSW5zeLN/BGXv33AHYkYPnc6d2Lbqp8tq+/qwm511yS3WcJ9QwwJJLnNwqeke5KvjdXvos+sk5W/rePvEu00pctlbQ4q6b4hkoSS3GZxp7pJyPk6FBNvMp+I8IndTroLZkTBJLdZjAmZMvKRuqhVqIghch2KiTypVohQ5DoUE7LrSlzs+jyOQuxAzikNI+5q/zNKnXj9aPqos5atqDSrztkJsVUrqgFjKZerjsftHTf6vMVj9IfmOy0FDZX6yOFDmubavx1VuuNe2eXAeJXSb28JdLmOLn2lf1GNDnfyKIo9KIr0yf1FkAfwd03m24steT3OWvie79WrV69evXr16tWrV69evXr16tWrF6r/AA4sIsoKyfbTAAAAAElFTkSuQmCC',
  description: 'Solid Community',
  type: 'solid',
  configuration: {
    issuer: 'https://solid.community',
    loginUri: 'https://solid.community/login',
  },
} ]));

const connectSource = (
  context: DemoContext,
  event: SourceSelectedEvent
): Observable<ConnectedEvent> => of(new ConnectedEvent());

/* MACHINE */

export const demoMachine: MachineConfig<DemoContext, DemoStateSchema, DemoEvent> = {

  initial: DemoStates.AUTHENTICATING,

  states: {

    [DemoStates.AUTHENTICATING]: {
      on: {
        [DemoEvents.AUTHENTICATED]: {
          actions: assign({ session: (context, event) => event.session }),
          target: DemoStates.LOADING_INVITE,
        },
      },
    },

    [DemoStates.LOADING_INVITE]: {
      invoke: {
        src: loadInvite,
      },
      on: {
        [DemoEvents.INVITE_LOADED]: {
          actions: assign((context, event) => ({
            ... context,
            invite: event.invite,
            holder: event.holder,
            purpose: event.purpose,
          })),
          target: DemoStates.AWAITING_CONSENT,
        },
      },
    },

    [DemoStates.AWAITING_CONSENT]: {
      on: {
        [DemoEvents.CONSENT_GIVEN]: DemoStates.LOADING_SOURCES,
      },
    },

    [DemoStates.LOADING_SOURCES]: {
      invoke: {
        src: loadSources,
      },
      on: {
        [DemoEvents.SOURCES_LOADED]: {
          actions: assign({ sources: (context, event) => event.sources }),
          target: DemoStates.AWAITING_SOURCE_SELECTION,
        },
      },
    },

    [DemoStates.AWAITING_SOURCE_SELECTION]: {
      on: {
        [DemoEvents.SOURCE_SELECTED]: DemoStates.CONNECTING,
      },
    },

    [DemoStates.CONNECTING]: {
      invoke: {
        src: connectSource,
      },
      on: {
        [DemoEvents.CONNECTED]: DemoStates.CALLBACK,
      },
    },

    [DemoStates.CALLBACK]: {
      type: 'final',
    },

  },

};
