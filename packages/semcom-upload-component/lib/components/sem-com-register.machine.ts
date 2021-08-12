import { EventObject, MachineConfig, StateSchema, assign } from 'xstate';
import { of, from, zip, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { fetch as solidFetch } from '@digita-ai/ui-transfer-solid-client';
import { Session } from '@digita-ai/ui-transfer-components';
import jsSHA from 'jssha';
import { Parser } from 'n3';
import { UploadFormContext } from './sem-com-upload-form.component';

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
    || !event.uploadFormContext.labelInput
    || !event.uploadFormContext.description
    || !event.uploadFormContext.author
    || !event.uploadFormContext.tag
    || !event.uploadFormContext.shapes
    || !event.uploadFormContext.version
    || event.uploadFormContext.latest === undefined
    || !event.uploadFormContext.checksum) {

    return of(new DataNotSavedEvent('Received invalid component metadata.'));

  }

  // create the quad of the component
  let data = `<#semcom-component>
  a <http://semcom.digita.ai/voc#component>;
  <http://semcom.digita.ai/voc#uri> <${event.uploadFormContext.uri}>;
  <http://semcom.digita.ai/voc#label> "${event.uploadFormContext.labelInput}";
  <http://semcom.digita.ai/voc#description> "${event.uploadFormContext.description}";
  <http://semcom.digita.ai/voc#author> "${event.uploadFormContext.author}";
  <http://semcom.digita.ai/voc#tag> "${event.uploadFormContext.tag}";
  <http://semcom.digita.ai/voc#shape> `;

  // shapes can contain multiple strings, so add each of them separated by a comma
  for (const url of event.uploadFormContext.shapes.split(',')) {

    data += `<${url}>,`;

  }

  // replace the last comma from the shapes with a ';'
  data = data.substr(0, data.length-1);

  data += `;
  <http://semcom.digita.ai/voc#version> "${event.uploadFormContext.version}";
  <http://semcom.digita.ai/voc#latest> "${event.uploadFormContext.latest}";
  <http://semcom.digita.ai/voc#checksum> "${event.uploadFormContext.checksum}".`;

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
          .filter((quad) => quad.object.value === 'http://www.w3.org/ns/ldp#Resource')
          .filter((quad) => quad.subject.value !== '')
          .map((quad) => quad.subject.value)
        : undefined
    )),
    // if the pod is offline, return an empty set
    catchError(() => of(new Set<string>())),
    switchMap((components) => {

      // if the component already contains a component with the same name, dont save the data
      if (components.has(hash)) { return throwError(new Error('Component already exists.')); } else {

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
