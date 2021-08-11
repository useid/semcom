import { html, unsafeCSS, css, CSSResult, TemplateResult, property, state, query } from 'lit-element';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { RxLitElement } from 'rx-lit';
import { DoneEvent, interpret } from 'xstate';
import { FormCleanlinessStates, FormRootStates, FormSubmissionStates, FormValidationStates, FormEvents, formMachine, FormValidatorResult, FormContext } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import valid from 'semver/functions/valid';

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
export class SemComUploadFormComponent extends RxLitElement {

  @property({ type: Array })
  public semComStoreUrls: string[];

  formMachine = formMachine<UploadFormContext> ((context, event) => this.validateUploadForm(context)).withContext({
    data: { uri: '', labelInput: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
    original: { uri: '', labelInput: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
  });

  /** The actor responsible for form validation in this component.  */
  // eslint-disable-next-line no-console -- this is a state logger
  formActor = interpret(this.formMachine, { devTools: true }).onTransition((appState) => console.log(appState.value));

  /** Indicates if if the form validation passed. */
  @state()
  isValid? = false;

  /** Indicates if one of the form fields has changed. */
  @state()
  isDirty? = false;

  /** All fields from the form, used for validation */
  @query('#uri')
  uri: HTMLInputElement;

  @query('#labelInput')
  labelInput: HTMLInputElement;

  @query('#description')
  description: HTMLInputElement;

  @query('#author')
  author: HTMLInputElement;

  @query('#tag')
  tag: HTMLInputElement;

  @query('#shapes')
  shapes: HTMLTextAreaElement;

  @query('#version')
  version: HTMLInputElement;

  @query('#latest')
  latest: HTMLSelectElement;

  @query('#checksum')
  checksum: HTMLTextAreaElement;

  constructor() {

    super();

    this.subscribe('isValid', from(this.formActor).pipe(
      map((machineState) => machineState.matches({
        [FormSubmissionStates.NOT_SUBMITTED]:{
          [FormRootStates.VALIDATION]: FormValidationStates.VALID,
        },
      })),
    ));

    this.subscribe('isDirty', from(this.formActor).pipe(
      map((machineState) => machineState.matches({
        [FormSubmissionStates.NOT_SUBMITTED]:{
          [FormRootStates.CLEANLINESS]: FormCleanlinessStates.DIRTY,
        },
      })),
    ));

    this.formActor.onDone((event: DoneEvent) => {

      this.dispatchEvent(new CustomEvent('formSubmitted', { detail: {
        uri: event.data.data.uri,
        labelInput: event.data.data.labelInput,
        description: event.data.data.description,
        author: event.data.data.author,
        tag:event.data.data.tag,
        shapes: event.data.data.shapes,
        version: event.data.data.version,
        latest: event.data.data.latest,
        checksum: event.data.data.checksum,
      } }));

    });

    this.formActor.start();

  }

  validateUploadForm = async (context: FormContext<UploadFormContext>): Promise<FormValidatorResult[]> => {

    const res: FormValidatorResult[] = [];

    // only validate dirty fields
    const dirtyFields = Object.keys(context.data).filter((field) =>
      context.data[field as keyof UploadFormContext]
    !== context.original[field as keyof UploadFormContext]);

    for (const field of dirtyFields) {

      const value = context.data[field as keyof UploadFormContext];

      if (field === 'uri') {

        // the value must be a valid URL
        try {

          new URL(value);

        } catch {

          res.push({ field, message: 'must be a valid URI' });

        }

      }

      if (field === 'shapes') {

        const urls = value.split(',');
        let validShapes = true;

        for (const url of urls) {

          try {

            new URL(url);

          } catch {

            validShapes = false;

          }

        }

        if (!validShapes) { res.push({ field, message: 'Must a be a comma-separated list of valid URLs' }); }

      }

      if (field === 'version') {

        if (!valid(value)) { res.push({ field, message: 'Must a valid Semantic Version of pattern "x.x.x"' }); }

      }

    }

    return res;

  };

  render(): TemplateResult {

    const hasEmptyFields = () => this.uri?.value.trim() === ''
      || this.labelInput?.value.trim() === ''
      || this.description?.value.trim() === ''
      || this.author?.value.trim() === ''
      || this.tag?.value.trim() === ''
      || this.shapes?.value.trim() === ''
      || this.version?.value.trim() === ''
      || this.checksum?.value.trim() === '';

    const validateOnSubmission = () => {

      const errorDiv = this.shadowRoot.querySelector('#error');
      errorDiv.innerHTML = '';
      const errorP = document.createElement('p');

      if (hasEmptyFields()) {

        errorP.innerText = 'No fields can be empty';

        errorDiv.appendChild(errorP);

      } else if (!this.isValid) {

        errorP.innerText = 'All fields must be valid';
        errorDiv.appendChild(errorP);

      } else {

        this.formActor.send(FormEvents.FORM_SUBMITTED);

      }

    };

    return html`
      <div id="content">
        <div id="error"></div>

        <div id="first">
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="uri">
            <label slot="label" for="uri">Uri</label>
            <input type="text" slot="input" placeholder="https:// ..." name="uri" id="uri"/>
          </form-element-component>
        </div>

        <div>
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="labelInput">
            <label slot="label" for="labelInput">Label</label>
            <input type="text" slot="input" name="labelInput" id="labelInput"/>
          </form-element-component>
        </div>

        <div>
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="description">
            <label slot="label" for="description">Description</label>
            <input type="text" slot="input" name="description" id="description"/>
          </form-element-component>
        </div>

        <div>
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="author">
            <label slot="label" for="author">Author</label>
            <input type="text" slot="input" name="author" id="author"/>
          </form-element-component>
        </div>

        <div>
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="tag">
            <label slot="label" for="tag">Tag</label>
            <input type="text" slot="input" name="tag" id="tag"/>
          </form-element-component>
        </div>

        <div>
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="shapes">
            <label slot="label" for="shapes">Shapes</label>
            <textarea type="text" slot="input" name="shapes" id="shapes" placeholder="https:// ..., https:// ..."></textarea>
          </form-element-component>
        </div>

        <div id="flexRow">
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="version" id="versionDiv">
            <label slot="label" for="version">Version</label>
            <input type="text" slot="input" name="version" id="version" placeholder="0.2.0"/>
          </form-element-component>

          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="latest" id="latestDiv">
            <label slot="label" for="latest">Latest</label>
            <select slot="input" name="latest" id="latest">
              <option id="false" value="false" selected>false</option>
              <option id="true" value="true">true</option>
            </select>
          </form-element-component>
        </div>

        <div id="last">
          <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="checksum">
            <label slot="label" for="checksum">Checksum</label>
            <textarea type="text" slot="input" name="checksum" id="checksum"></textarea>
          </form-element-component>
        </div>

        <!-- UPGRADE THIS TO new FormSubmittedEvent() WHEN THE TYPE IS FIXED -->
        <button ?disabled="${false}" type="button" @click="${validateOnSubmission}">Save Data</button>
      </div>
    `;

  }

  static get styles(): CSSResult[] {

    return [
      unsafeCSS(Theme),

      css`

        :host {
          display: flex;
          flex-direction: column;
        }

        #content > * {
          width: 100%;
          margin: var(--gap-large) 0 var(--gap-large) 0;
        }
        
        #first {
          margin-top: 0px;
        }

        #last {
          margin-bottom: 0px;
        }

        textarea {
          resize: none;
          height: calc(3 * var(--gap-large))
        }

        #flexRow {
          display: grid;
          grid-template-columns: 1fr 1fr
        }
        
        #versionDiv {
          margin-right: var(--gap-normal)
        }

        #latestDiv {
          margin-left: var(--gap-normal)
        }
        
        button {
          height: var(--gap-large);
        }

        select {
          border: none;
          height: var(--gap-large)
        }

        select:invalid {
          color: gray;
        }

        option {
          color: var(--colors-foreground-dark);
        }

        input {
          border: none;
          height: var(--gap-large)
        }

        input:focus,
        select:focus {
          outline: none;
        }

        #error {
          background-color: var(--colors-status-warning)
        }

        #error p {
          padding: var(--gap-small) var(--gap-normal)
        }

      `,
    ];

  }

}

export default SemComUploadFormComponent;

