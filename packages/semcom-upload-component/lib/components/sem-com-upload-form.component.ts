import { html, unsafeCSS, css, CSSResult, TemplateResult, property, state, query } from 'lit-element';
import { Theme } from '@useid/ui-transfer-theme';
import { RxLitElement } from 'rx-lit';
import { DoneEvent, interpret } from 'xstate';
import { FormCleanlinessStates, FormRootStates, FormSubmissionStates, FormValidationStates, formMachine, FormValidatorResult, FormContext, FormElementComponent, FormSubmittedEvent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import valid from 'semver/functions/valid';

/**
 * Interface representing upload form fields.
 */
export interface UploadFormContext {
  uri: string;
  label: string;
  description: string;
  author: string;
  tag: string;
  shapes: string;
  version: string;
  latest: string;
  checksum: string;
  [key: string]: string;
}

/**
 * A LitElement WebComponent for entering component metadata.
 */
export class SemComUploadFormComponent extends RxLitElement {

  @property({ type: Array })
  public semComStoreUrls: string[];

  formMachine = formMachine<UploadFormContext> ((context, event) => this.validateUploadForm(context)).withContext({
    data: { uri: '', label: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
    original: { uri: '', label: '', description: '', author: '', tag:'', shapes: '', version: '', latest: 'false', checksum: '' },
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

  @query('#label')
  label: HTMLInputElement;

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

  /**
   * Creates a { SemComUploadFormComponent }.
   */
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
        label: event.data.data.label,
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

  /**
   * Defines components by the provided tag and module.
   *
   * @param { string } tag - The tag to define the component by.
   * @param { CustomElementConstructor } module  - The module to define the component by.
   */
  defineComponent = (tag: string, module: CustomElementConstructor): void => {

    if (!customElements.get(tag)) { customElements.define(tag, module); }

  };

  /**
   * Validates the upload form by checking the validity of the different fields.
   *
   * @param { FormContext<UploadFormContext> } context - The form context to validate.
   */
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

  /**
   * Checks if the form has empty fields.
   */
  hasEmptyFields = (): boolean => this.uri?.value.trim() === ''
      || this.label?.value.trim() === ''
      || this.description?.value.trim() === ''
      || this.author?.value.trim() === ''
      || this.tag?.value.trim() === ''
      || this.shapes?.value.trim() === ''
      || this.version?.value.trim() === ''
      || this.checksum?.value.trim() === '';

  /**
   * Validates the form upon submission by checking the validity and content of the fields
   * and setting error messages accordingly.
   */
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

  /**
   * Generates a HTML template for a form input element.
   *
   * @param { string } field - The name of the input field.
   * @param options (optional) - The options for the input field element.
   */
  generateInputFormElement = (field: string, options?: { placeholder?: string; debounceTimeout?: string }): TemplateResult => html`
      <form-element-component debounceTimeout="${options?.debounceTimeout ? options.debounceTimeout : '0'}" .actor="${this.formActor}" .translator=${this.translator} field="${field}">
        <label slot="label" for="${field}">${field.charAt(0).toUpperCase() + field.substr(1)}</label>
        <input type="text" slot="input" placeholder="${options?.placeholder ? options.placeholder : ''}" name="${field}" id="${field}"/>
      </form-element-component>
    `;

  generateTextAreaFormElement = (field: string, options?: { placeholder?: string; debounceTimeout?: string }): TemplateResult => html`
      <form-element-component debounceTimeout="${options?.debounceTimeout ? options.debounceTimeout : '0'}" .actor="${this.formActor}" .translator=${this.translator} field="${field}">
        <label slot="label" for="${field}">${field.charAt(0).toUpperCase() + field.substr(1)}</label>
        <textarea type="text" slot="input" placeholder="${options?.placeholder ? options.placeholder : ''}" name="${field}" id="${field}"></textarea>
      </form-element-component>
    `;

  /**
   * Renders a HTML upload form template.
   */
  render(): TemplateResult {

    return html`
      <div id="content">
        <div id="error"></div>

        <div id="first">
          ${this.generateInputFormElement('uri', { debounceTimeout: '250', placeholder: 'https:// ...' })}
        </div>

        <div>
          ${this.generateInputFormElement('label')}
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
          ${this.generateTextAreaFormElement('shapes', { debounceTimeout: '250', placeholder: 'https:// ..., https:// ...' })}
        </div>

        <div id="flexRow">
          
          <div id="versionDiv">
            ${this.generateInputFormElement('version', { debounceTimeout: '250', placeholder: '0.2.0' })}
          </div>

          <div id="latestDiv">
            <form-element-component debounceTimeout="0" .actor="${this.formActor}" .translator=${this.translator} field="latest">
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

  /**
   * Get the CSS for the form element.
   */
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

        textarea {
          border:none;
          resize: none;
          height: calc(3 * var(--gap-large))
        }

        input:focus,
        select:focus,
        textarea:focus {
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

