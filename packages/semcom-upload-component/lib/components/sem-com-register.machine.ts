import { EventObject, MachineConfig, StateSchema, assign } from 'xstate';
import { of, from, zip, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { fetch as solidFetch } from '@digita-ai/ui-transfer-solid-client';
import { Session } from '@digita-ai/ui-transfer-components';
import jsSHA from 'jssha';
import { Parser, DataFactory, Writer } from 'n3';
import { UploadFormContext } from './sem-com-upload-form.component';

const { namedNode, literal, quad } = DataFactory;

/* CONTEXT */

export interface SemComRegisterContext {
  session?: Session;
  url?: string;
}

export interface SemComRegisterContextWithSession extends SemComRegisterContext {
  session: Session;
}

export interface SemComRegisterContextWithUrl extends SemComRegisterContext {
  url: string;
}

/* STATES */

export enum SemComRegisterStates {
  AUTHENTICATING = '[SemComRegisterState: Authenticating]',
  STORE_SELECTION = '[SemComRegisterState: Store Selection]',
  CHECKING_PERMISSION = '[SemComRegisterState: Checking Permission]',
  UPLOAD_COMPONENT_FORM = '[SemComRegisterState: Upload Component_Form]',
  NOT_PERMITTED = '[SemComRegisterState: Not Permitted]',
  UPLOADING_COMPONENT = '[SemComRegisterState: Uploading Component]',
  SUCCESSFULLY_SAVED_DATA = '[SemComRegisterState: Successfully Saved Data]',
  ERROR_SAVING_DATA = '[SemComRegisterState: Error Saving Data]',
}

export type SemComRegisterState = {
  value: SemComRegisterStates.AUTHENTICATING;
  context: SemComRegisterContext;
} | {
  value:
  | SemComRegisterStates.STORE_SELECTION
  | SemComRegisterStates.CHECKING_PERMISSION;
  context: SemComRegisterContextWithSession;
} | {
  value:
  | SemComRegisterStates.UPLOAD_COMPONENT_FORM
  | SemComRegisterStates.NOT_PERMITTED
  | SemComRegisterStates.UPLOADING_COMPONENT
  | SemComRegisterStates.SUCCESSFULLY_SAVED_DATA
  | SemComRegisterStates.ERROR_SAVING_DATA;
  context: SemComRegisterContextWithUrl;
};

export interface SemComRegisterStateSchema extends StateSchema<SemComRegisterContext> {
  states: {
    [key in SemComRegisterStates]?: StateSchema<SemComRegisterContext>;
  };
}

/* EVENTS */

export enum SemComRegisterEvents {
  AUTHENTICATED = '[SemComRegisterEvent: Authenticated]',
  STORE_SELECTED = '[SemComRegisterEvent: Store Selected]',
  HAS_PERMISSION = '[SemComRegisterEvent: Has Permission]',
  NO_PERMISSION = '[SemComRegisterEvent: No Permission]',
  BACK_TO_STORE_SELECTION = '[SemComRegisterEvent: Back To Store Selection]',
  BACK_TO_UPLOAD_FORM = 'SemComRegisterEvent: Back To Upload Form',
  UPLOAD_FORM_SUBMITTED = '[SemComRegisterEvent: Upload form Submitted]',
  DATA_SAVED = '[SemComRegisterEvent: Data Saved]',
  DATA_NOT_SAVED = '[SemComRegisterEvent: Data Not Saved]',
}

export class AuthenticatedEvent implements EventObject {

  public type: SemComRegisterEvents.AUTHENTICATED = SemComRegisterEvents.AUTHENTICATED;
  constructor(public session: Session) {}

}

export class StoreSelectedEvent implements EventObject {

  public type: SemComRegisterEvents.STORE_SELECTED = SemComRegisterEvents.STORE_SELECTED;
  constructor(public input: string) {}

}

export class HasPermissionEvent implements EventObject {

  public type: SemComRegisterEvents.HAS_PERMISSION = SemComRegisterEvents.HAS_PERMISSION;
  constructor(public url: string) {}

}

export class NoPermissionEvent implements EventObject {

  public type: SemComRegisterEvents.NO_PERMISSION = SemComRegisterEvents.NO_PERMISSION;
  constructor(public errorMessage: string) {}

}

export class BackToStoreSelectionEvent implements EventObject {

  public type: SemComRegisterEvents.BACK_TO_STORE_SELECTION = SemComRegisterEvents.BACK_TO_STORE_SELECTION;

}

export class BackToUploadFormEvent implements EventObject {

  public type: SemComRegisterEvents.BACK_TO_UPLOAD_FORM = SemComRegisterEvents.BACK_TO_UPLOAD_FORM;

}

export class UploadFormSubmittedEvent implements EventObject {

  public type: SemComRegisterEvents.UPLOAD_FORM_SUBMITTED = SemComRegisterEvents.UPLOAD_FORM_SUBMITTED;
  constructor (public uploadFormContext: UploadFormContext) {}

}

export class DataSavedEvent implements EventObject {

  public type: SemComRegisterEvents.DATA_SAVED = SemComRegisterEvents.DATA_SAVED;

}

export class DataNotSavedEvent implements EventObject {

  public type: SemComRegisterEvents.DATA_NOT_SAVED = SemComRegisterEvents.DATA_NOT_SAVED;
  constructor(public errorMessage: string) {}

}

export type SemComRegisterEvent =
| AuthenticatedEvent
| StoreSelectedEvent
| HasPermissionEvent
| NoPermissionEvent
| BackToStoreSelectionEvent
| BackToUploadFormEvent
| UploadFormSubmittedEvent
| DataSavedEvent
| DataNotSavedEvent;

/* MACHINE */

const handleStoreSelectedEvent = (event: StoreSelectedEvent) => {

  const url = event.input;

  if (!url) { return of(new NoPermissionEvent('Error retrieving the selected store. Please try again, or choose another store.')); }

  return from(solidFetch(url, { method: 'HEAD' })).pipe(
    switchMap((response) => {

      if (response.headers.get('link') && response.headers.get('link').includes('<http://www.w3.org/ns/pim/space#Storage>; rel="type"')) {

        const wacAllowHeader = response.headers.get('wac-allow');
        const userRights = wacAllowHeader.replace(/.*user="([^"]*)".*/, '$1');

        return userRights.includes('append') ? of(new HasPermissionEvent(url)) : of(new NoPermissionEvent('You do not have permission to edit this store. Please choose another store or log in with a user account that has access to this store.'));

      }

      return of(new NoPermissionEvent('The selected url did not lead to a valid store. Please choose another store.'));

    }),
    catchError((error) => of(new NoPermissionEvent(`Encountered an error retrieving the store, please try again, or choose a different store: "${error.message}"`)))
  );

};

const handleUploadFormSubmittedEvent = (context: SemComRegisterContext, event: UploadFormSubmittedEvent) => {

  // If somehow all previous checks failed and a field is still empty, don't save the data.
  if (!event.uploadFormContext.uri
    || !event.uploadFormContext.label
    || !event.uploadFormContext.description
    || !event.uploadFormContext.author
    || !event.uploadFormContext.tag
    || !event.uploadFormContext.shapes
    || !event.uploadFormContext.version
    || event.uploadFormContext.latest === undefined
    || !event.uploadFormContext.checksum) {

    return of(new DataNotSavedEvent('Received invalid component metadata.'));

  }

  // shapes can be multiple comma separated urls, so split them, then create a quad for each.
  const shapeQuads = event.uploadFormContext.shapes.split(',').map((shape) =>
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#shape'), namedNode(shape)));

  // create quads for all of the component metadata
  const quads = [
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://semcom.digita.ai/voc#component'),),
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#label'), literal(event.uploadFormContext.label)),
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#description'),  literal(event.uploadFormContext.description)),
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#author'), literal(event.uploadFormContext.author)),
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#version'), literal(event.uploadFormContext.version)),
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#latest'), literal(String(event.uploadFormContext.latest))),
    quad(namedNode(event.uploadFormContext.uri), namedNode('http://semcom.digita.ai/voc#tag'), literal(event.uploadFormContext.tag)),
    ...shapeQuads,
  ];

  const writer = new Writer();

  writer.addQuads(quads);

  // Hash the component's uri to serve as the file name
  const shaObj = new jsSHA('SHAKE256', 'TEXT');
  shaObj.update(event.uploadFormContext.uri);
  const hash = shaObj.getHash('B64', { outputLen: 256 }).replace(/[+=/]/g, '').toLowerCase();

  // fetch the contents of the pod
  return from(solidFetch(context.url, { headers: { 'Accept': 'text/turtle' } })).pipe(
    switchMap((response) => zip(of(response), from(response.text()))),
    // return a set of all filenames within the pod
    map(([ response, responseText ]) => new Set(
      response.status === 200
        ? new Parser({ format: 'Turtle' }).parse(responseText)
          .filter((quadFromResponse) => quadFromResponse.object.value === 'http://www.w3.org/ns/ldp#Resource')
          .filter((quadFromResponse) => quadFromResponse.subject.value !== '')
          .map((quadFromResponse) => quadFromResponse.subject.value)
        : undefined
    )),
    // if the pod is offline, return an empty set
    catchError(() => of(new Set<string>())),
    switchMap((components) => zip(of(components), of(writer))),
    switchMap(([ components, quadWriter ]) => {

      // if the component already contains a component with the same name, dont save the data
      if (components.has(hash)) { return throwError(new Error('Component already exists.')); } else {

        let data = '';

        quadWriter.end((error, result) => {

          if (error) {

            throw error;

          }

          data = result;

        })
        ;

        // save the metadata of the component to the pod, with the hashed url as the filename
        return from(solidFetch(context.url, {
          method: 'POST',
          headers: {
            'slug': hash,
            'content-type': 'text/turtle',
          },
          body: data,
        }));

      }

    }),
    switchMap((response) => response.status === 201
      ? of(new DataSavedEvent())
      : of(new DataNotSavedEvent('Data was not saved succesfully. Please try again.'))),
    catchError((error) => of(new DataNotSavedEvent(`Encountered an error while trying to save the data: "${error.message}"`)))
  );

};

export const semComRegisterMachine: MachineConfig<
SemComRegisterContext,
SemComRegisterStateSchema,
SemComRegisterEvent> = {

  initial: SemComRegisterStates.AUTHENTICATING,
  context: {},
  states: {

    [SemComRegisterStates.AUTHENTICATING]: {
      on: {
        [SemComRegisterEvents.AUTHENTICATED]: {
          actions: assign({ session: (_, event) => event.session }),
          target: SemComRegisterStates.STORE_SELECTION,
        },
      },
    },

    [SemComRegisterStates.STORE_SELECTION]: {
      on: {
        [SemComRegisterEvents.STORE_SELECTED]: {
          target: SemComRegisterStates.CHECKING_PERMISSION,
        },
      },
    },

    [SemComRegisterStates.CHECKING_PERMISSION]: {
      invoke: {
        src: (context, event: StoreSelectedEvent) => handleStoreSelectedEvent(event),
      },
      on: {
        [SemComRegisterEvents.HAS_PERMISSION]: {
          actions: assign({ url: (_, event) => event.url }),
          target: SemComRegisterStates.UPLOAD_COMPONENT_FORM,
        },
        [SemComRegisterEvents.NO_PERMISSION]: {
          target: SemComRegisterStates.NOT_PERMITTED,
        },
      },
    },

    [SemComRegisterStates.UPLOAD_COMPONENT_FORM]: {
      on: {
        [SemComRegisterEvents.UPLOAD_FORM_SUBMITTED]: {
          target: SemComRegisterStates.UPLOADING_COMPONENT,
        },
      },
    },

    [SemComRegisterStates.NOT_PERMITTED]: {
      on: {
        [SemComRegisterEvents.BACK_TO_STORE_SELECTION]: {
          target: SemComRegisterStates.STORE_SELECTION,
        },
      },
    },

    [SemComRegisterStates.UPLOADING_COMPONENT]: {
      invoke: {
        src: (context, event: UploadFormSubmittedEvent) => handleUploadFormSubmittedEvent(context, event),
      },
      on: {
        [SemComRegisterEvents.DATA_SAVED]: {
          target: SemComRegisterStates.SUCCESSFULLY_SAVED_DATA,
        },
        [SemComRegisterEvents.DATA_NOT_SAVED]: {
          target: SemComRegisterStates.ERROR_SAVING_DATA,
        },
      },
    },

    [SemComRegisterStates.SUCCESSFULLY_SAVED_DATA]: {
      on: {
        [SemComRegisterEvents.BACK_TO_UPLOAD_FORM]: {
          target: SemComRegisterStates.UPLOAD_COMPONENT_FORM,
        },
      },
    },

    [SemComRegisterStates.ERROR_SAVING_DATA]: {
      on: {
        [SemComRegisterEvents.BACK_TO_STORE_SELECTION]: {
          target: SemComRegisterStates.STORE_SELECTION,
        },
      },
    },
  },

};
