import { html, unsafeCSS, css, CSSResult, TemplateResult, property, state, query } from 'lit-element';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { RxLitElement } from 'rx-lit';
import { DoneEvent, interpret } from 'xstate';
import { FormCleanlinessStates, FormRootStates, FormSubmissionStates, FormValidationStates, formMachine, FormValidatorResult, FormContext, FormElementComponent, FormSubmittedEvent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
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
  [key: string]: string;
}

export class SemComUploadFormComponent extends RxLitElement {

  @property({ type: Array })
  public semComStoreUrls: string[];

  formMachine = formMachine<UploadFormContext> ((context, event) => this.validateUploadForm(context)).withContext({
    data: { uri: '', labelInput: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
    original: { uri: '', labelInput: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
  });

  /** The actor responsible for form validation in this component.  */
  formActor = interpret(this.formMachine, { devTools: true });
  /** Indicates if if the form validation passed. */
  @state()
  isValid? = false;

  /** Indicates if one of the form fields has changed. */
  @state()
  isDirty? = false;

  /** Div to push validation error messages. */
  @query('#error')
  errorDiv: HTMLDivElement;

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

    this.defineComponent('form-element-component', FormElementComponent);

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

  // What type is module?
  defineComponent = (tag: string, module: CustomElementConstructor): void => {

    if (!customElements.get(tag)) { customElements.define(tag, module); }

  };

  validateUploadForm = async (context: FormContext<UploadFormContext>): Promise<FormValidatorResult[]> => {

    // only validate dirty fields
    const dirtyFields = Object.keys(context.data).filter((field) =>
      context.data[field]
    !== context.original[field]);

    const errors: FormValidatorResult[] = dirtyFields.map((field) => {

      const value = context.data[field];

      if (field === 'uri') {

        // the value must be a valid URL
        try {

          new URL(value);

        } catch {

          return { field, message: 'must be a valid URI' };

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

        if (!validShapes) { return { field, message: 'Must a be a comma-separated list of valid URLs' }; }

      }

      if (field === 'version') {

        if (!valid(value)) { return { field, message: 'Must a valid Semantic Version of pattern "x.x.x"' }; }

      }

      return undefined;

    });

    return errors.filter((error) => error !== undefined);

  };

  hasEmptyFields = (): boolean => this.uri?.value.trim() === ''
      || this.labelInput?.value.trim() === ''
      || this.description?.value.trim() === ''
      || this.author?.value.trim() === ''
      || this.tag?.value.trim() === ''
      || this.shapes?.value.trim() === ''
      || this.version?.value.trim() === ''
      || this.checksum?.value.trim() === '';

  validateOnSubmission = (): void => {

    this.errorDiv.innerHTML = '';
    const errorP = document.createElement('p');

    if (this.hasEmptyFields()) {

      errorP.innerText = 'No fields can be empty';

      this.errorDiv.appendChild(errorP);

    } else if (!this.isValid) {

      errorP.innerText = 'All fields must be valid';
      this.errorDiv.appendChild(errorP);

    } else {

      this.formActor.send(new FormSubmittedEvent());

    }

  };

  translator = { translate: (value: string): string => value };

  generateInputFormElement = (field: string, placeholder?: string): TemplateResult => html`
      <form-element-component .actor="${this.formActor}" .translator=${this.translator} field="${field}">
        <label slot="label" for="${field}">${field.charAt(0).toUpperCase() + field.substr(1)}</label>
        <input type="text" slot="input" placeholder="${placeholder ? placeholder : ''}" name="${field}" id="${field}"/>
      </form-element-component>
    `;

  generateTextAreaFormElement = (field: string, placeholder?: string): TemplateResult => html`
      <form-element-component .actor="${this.formActor}" .translator=${this.translator} field="${field}">
        <label slot="label" for="${field}">${field === 'labelInput' ? 'Label' : field.charAt(0).toUpperCase() + field.substr(1)}</label>
        <textarea type="text" slot="input" placeholder="${placeholder ? placeholder : ''}" name="${field}" id="${field}"></textarea>
      </form-element-component>
    `;

  render(): TemplateResult {

    return html`
      <div id="content">
        <div id="error"></div>

        <div id="first">
          ${this.generateInputFormElement('uri', 'https:// ...')}
        </div>

        <div>
          ${this.generateInputFormElement('labelInput')}
        </div>

        <div>
          ${this.generateInputFormElement('description')}
        </div>

        <div>
          ${this.generateInputFormElement('author')}
        </div>

        <div>
          ${this.generateInputFormElement('tag')}
        </div>

        <div>
          ${this.generateTextAreaFormElement('shapes', 'https:// ..., https:// ...')}
        </div>

        <div id="flexRow">
          
          <div id="versionDiv">
            ${this.generateInputFormElement('version', '0.2.0')}
          </div>

          <div id="latestDiv">
            <form-element-component .actor="${this.formActor}" .translator=${this.translator} field="latest">
              <label slot="label" for="latest">Latest</label>
              <select slot="input" name="latest" id="latest">
                <option id="false" value="false" selected>false</option>
                <option id="true" value="true">true</option>
              </select>
            </form-element-component>
          </div>
        </div>

        <div id="last">
          ${this.generateTextAreaFormElement('checksum')}
        </div>

        <button type="button" @click="${this.validateOnSubmission}">Save Data</button>
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

