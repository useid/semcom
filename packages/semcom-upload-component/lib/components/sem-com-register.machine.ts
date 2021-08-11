import { EventObject, MachineConfig, StateSchema, send, assign } from 'xstate';
import { formMachine, FormActors, FormContext, FormValidatorResult, FormEvent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fetch as solidFetch } from '@digita-ai/ui-transfer-solid-client';
import { Session } from '@digita-ai/ui-transfer-components';

/* CONTEXT */

export interface UploadFormContext {
  uri: string;
  labelInput: string;
  description: string;
  author: string;
  tag: string;
  shapes: string;
  version: string;
  latest: string;
  checksum: string;
}

export interface SemComRegisterContext {
  session?: Session;
  url?: string;
}

export const validateStoreSelectionForm =
async (context: FormContext<{ dropDown: string; freeInput: string }>): Promise<FormValidatorResult[]> => {

  const res: FormValidatorResult[] = [];

  // only validate dirty fields
  const dirtyFields = Object.keys(context.data).filter((field) =>
    context.data[field as keyof { dropDown: string; freeInput: string }]
    !== context.original[field as keyof { dropDown: string; freeInput: string }]);

  for (const field of dirtyFields) {

    const value = context.data[field as keyof { dropDown: string; freeInput: string }];

    if (field === 'freeInput') {

      if (!value) {

        res.push({ field, message: 'cannot be empty' });

      } else {

        // the value must be a valid URL
        try {

          new URL(value);

        } catch {

          res.push({ field, message: 'must be a valid URL of a solid pod' });

        }

      }

    }

  }

  return res;

};

// This function is not complete. Much of the form is currently not validated. Waiting for @lem-onade to return to fix this validation.
export const validateUploadForm =
async (context: FormContext<UploadFormContext>): Promise<FormValidatorResult[]> => {

  const res: FormValidatorResult[] = [];

  // only validate dirty fields
  const dirtyFields = Object.keys(context.data).filter((field) =>
    context.data[field as keyof UploadFormContext]
    !== context.original[field as keyof UploadFormContext]);

  for (const field of dirtyFields) {

    const value = context.data[field as keyof UploadFormContext];

    if (field === 'uri') {

      if (!value) {

        res.push({ field, message: 'cannot be empty' });

      } else {

        // the value must be a valid URL
        try {

          new URL(value);

        } catch {

          res.push({ field, message: 'must be a valid URL of a solid pod' });

        }

      }

    }

    if (field === 'labelInput') {

      if (!value) {

        res.push({ field, message: 'cannot be empty' });

      }

    }

  }

  if (event.type === '[FormEvent: Submitted]'){

    res.push({ field: 'description', message: 'cannot be empty' });

  }

  return res;

};

/* STATES */

export enum SemComRegisterStates {
  AUTHENTICATING = '[SemComRegisterState: Authenticating]',
  STORE_SELECTION = '[SemComRegisterState: Store_Selection]',
  CHECKING_PERMISSION = '[SemComRegisterState: Checking_Permission]',
  UPLOAD_COMPONENT_FORM = '[SemComRegisterState: Upload_Component_Form]',
  NOT_PERMITTED = '[SemComRegisterState: Not_Permitted]',
  UPLOADING_COMPONENT = '[SemComRegisterState: Uploading_Component]',
  SUCCESSFULLY_SAVED_DATA = '[SemComRegisterState: Successfully_Saved_Data]',
  ERROR_SAVING_DATA = '[SemComRegisterState: Error_Saving_Data]',
  DONE = '[SemComRegisterState: Done]',
}

export interface SemComRegisterState {
  value:
  | SemComRegisterStates.AUTHENTICATING
  | SemComRegisterStates.STORE_SELECTION
  | SemComRegisterStates.CHECKING_PERMISSION
  | SemComRegisterStates.UPLOAD_COMPONENT_FORM
  | SemComRegisterStates.NOT_PERMITTED
  | SemComRegisterStates.UPLOADING_COMPONENT
  | SemComRegisterStates.DONE;
  context: SemComRegisterContext;
}

export interface SemComRegisterStateSchema extends StateSchema<SemComRegisterContext> {
  states: {
    [key in SemComRegisterStates]?: StateSchema<SemComRegisterContext>;
  };
}

/* EVENTS */

export enum SemComRegisterEvents {
  AUTHENTICATED = '[SemComRegisterEvent: Authenticated]',
  STORE_SELECTED = '[SemComRegisterEvent: Store_Selected]',
  HAS_PERMISSION = '[SemComRegisterEvent: Has_Permission]',
  NO_PERMISSION = '[SemComRegisterEvent: No_Permission]',
  BACK_TO_STORE_SELECTION = '[SemComRegisterEvent: Back_To_Store_Selection]',
  BACK_TO_UPLOAD_FORM = 'SemComRegisterEvent: Back_To_Upload_Form',
  UPLOAD_FORM_SUBMITTED = '[SemComRegisterEvent: Upload_form_Submitted]',
  DATA_SAVED = '[SemComRegisterEvent: Data_Saved]',
  DATA_NOT_SAVED = '[SemComRegisterEvent: Data_Not_Saved]',
}

export class AuthenticatedEvent implements EventObject {

  public type: SemComRegisterEvents.AUTHENTICATED = SemComRegisterEvents.AUTHENTICATED;
  constructor(public session: Session) {}

}

export class StoreSelectedEvent implements EventObject {

  public type: SemComRegisterEvents.STORE_SELECTED = SemComRegisterEvents.STORE_SELECTED;
  constructor(public dropDown: string, public freeInput: string) {}

}

export class HasPermissionEvent implements EventObject {

  public type: SemComRegisterEvents.HAS_PERMISSION = SemComRegisterEvents.HAS_PERMISSION;
  constructor(public url: string) {}

}

export class NoPermissionEvent implements EventObject {

  public type: SemComRegisterEvents.NO_PERMISSION = SemComRegisterEvents.NO_PERMISSION;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

}

export class BackToStoreSelectionEvent implements EventObject {

  public type: SemComRegisterEvents.BACK_TO_STORE_SELECTION = SemComRegisterEvents.BACK_TO_STORE_SELECTION;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

}

export class BackToUploadFormEvent implements EventObject {

  public type: SemComRegisterEvents.BACK_TO_UPLOAD_FORM = SemComRegisterEvents.BACK_TO_UPLOAD_FORM;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

}

export class UploadFormSubmittedEvent implements EventObject {

  public type: SemComRegisterEvents.UPLOAD_FORM_SUBMITTED = SemComRegisterEvents.UPLOAD_FORM_SUBMITTED;
  constructor (public uploadFormContext: UploadFormContext) {}

}

export class DataSavedEvent implements EventObject {

  public type: SemComRegisterEvents.DATA_SAVED = SemComRegisterEvents.DATA_SAVED;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

}

export class DataNotSavedEvent implements EventObject {

  public type: SemComRegisterEvents.DATA_NOT_SAVED = SemComRegisterEvents.DATA_NOT_SAVED;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

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
          target: SemComRegisterStates.STORE_SELECTION,
        },
      },
    },

    [SemComRegisterStates.STORE_SELECTION]: {
      invoke: {
        id: FormActors.FORM_MACHINE,
        src: formMachine<{ dropDown: string; freeInput: string }> ((context) => validateStoreSelectionForm(context)),
        data: { data: { dropDown: 'empty', freeInput: '' }, original: { dropDown: 'empty', freeInput: '' } },
        onDone: { actions: send(
          (_, event) => new StoreSelectedEvent(event.data.data.dropDown, event.data.data.freeInput)
        ) },
      },
      on: {
        [SemComRegisterEvents.STORE_SELECTED]: {
          target: SemComRegisterStates.CHECKING_PERMISSION,
        },
      },
    },

    [SemComRegisterStates.CHECKING_PERMISSION]: {
      invoke: {
        src: (context, event: StoreSelectedEvent) => {

          const url = event.freeInput !== '' ? event.freeInput : (event.dropDown !== 'empty' ? event.dropDown : undefined);

          if (!url) { return of(new NoPermissionEvent()); }

          return from(solidFetch(url)).pipe(
            switchMap((response) => {

              if (response.headers.get('link').includes('<http://www.w3.org/ns/pim/space#Storage>; rel="type"')) {

                const wacAllowHeader = response.headers.get('wac-allow');
                const userRights = wacAllowHeader.replace(/.*user="([^"]*)".*/, '$1');

                return userRights.includes('append') ? of(new HasPermissionEvent(url)) : of(new NoPermissionEvent());

              }

              return of(new NoPermissionEvent());

            })
          );

        },
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
      invoke: {
        id: FormActors.FORM_MACHINE,
        src: formMachine<UploadFormContext> ((context, event) => validateUploadForm(context)),
        data: {
          data: { uri: '', labelInput: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
          original: { uri: '', labelInput: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
        },
        onDone: { actions: send(
          (_, event) => new UploadFormSubmittedEvent(
            {
              uri: event.data.data.uri,
              labelInput: event.data.data.labelInput,
              description: event.data.data.description,
              author: event.data.data.author,
              tag:event.data.data.tag,
              shapes: event.data.data.shapes,
              version: event.data.data.version,
              latest: event.data.data.latest,
              checksum: event.data.data.checksum,
            }
          )
        ) },
      },
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
        src: (context, event: UploadFormSubmittedEvent) => {

          if (!event.uploadFormContext.uri
            || !event.uploadFormContext.labelInput
            || !event.uploadFormContext.description
            || !event.uploadFormContext.author
            || !event.uploadFormContext.tag
            || !event.uploadFormContext.shapes
            || !event.uploadFormContext.version
            || event.uploadFormContext.latest === undefined
            || !event.uploadFormContext.checksum) {

            return of(new DataNotSavedEvent());

          }

          const data =
          `
          <#semcom-component>
            a <http://semcom.digita.ai/voc#component>;
            <http://semcom.digita.ai/voc#uri> <${event.uploadFormContext.uri}>;
            <http://semcom.digita.ai/voc#label> "${event.uploadFormContext.labelInput}";
            <http://semcom.digita.ai/voc#description> "${event.uploadFormContext.description}";
            <http://semcom.digita.ai/voc#author> "${event.uploadFormContext.author}";
            <http://semcom.digita.ai/voc#tag> "${event.uploadFormContext.tag}";
            <http://semcom.digita.ai/voc#shapes> <${event.uploadFormContext.shapes}>;
            <http://semcom.digita.ai/voc#version> "${event.uploadFormContext.version}";
            <http://semcom.digita.ai/voc#latest> "${event.uploadFormContext.latest}";
            <http://semcom.digita.ai/voc#checksum> "${event.uploadFormContext.checksum}".
          `;

          return from(solidFetch(context.url, {
            method: 'POST',
            headers: {
              'content-type': 'text/turtle',
            },
            body: data,
          })).pipe(
            switchMap((response) => response.status === 201 ? of(new DataSavedEvent()) : of(new DataNotSavedEvent())),
          );

        },
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
