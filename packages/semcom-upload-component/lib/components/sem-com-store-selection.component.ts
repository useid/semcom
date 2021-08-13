import { html, unsafeCSS, css, CSSResult, TemplateResult, property, state, query } from 'lit-element';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { RxLitElement } from 'rx-lit';
import { DoneEvent, interpret } from 'xstate';
import { FormCleanlinessStates, FormRootStates, FormSubmissionStates, FormValidationStates, FormUpdatedEvent, formMachine, FormContext, FormValidatorResult, FormElementComponent, FormSubmittedEvent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StoreSelectionContext {
  dropDown: string;
  freeInput: string;
  [key: string]: string;
}

export class SemComStoreSelectionComponent extends RxLitElement {

  /** A space separated list of urls, each of which points to a SemCom store */
  @property({ type: String })
  public semComStoreUrls: string;

  formMachine = formMachine<{ dropDown: string; freeInput: string }> (
    (context) => this.validateStoreSelectionForm(context)
  ).withContext({ data: { dropDown: 'empty', freeInput: '' }, original: { dropDown: 'empty', freeInput: '' } });

  /** The actor responsible for form validation in this component.  */
  formActor = interpret(this.formMachine, { devTools: true });

  /** Indicates if if the form validation passed. */
  @state()
  isValid = false;

  /** Indicates if one of the form fields has changed. */
  @state()
  isDirty = false;

  /** The freeInput element from the DOM */
  @query('#freeInput')
  freeInput: HTMLInputElement;

  /** The dropDown element from the DOM */
  @query('#dropDown')
  dropDown: HTMLSelectElement;

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

      this.dispatchEvent(new CustomEvent('formSubmitted', {
        detail: {
          input: event.data.data.freeInput !== '' ? event.data.data.freeInput : (event.data.data.dropDown !== 'empty' ? event.data.data.dropDown : undefined),
        },
      }));

    });

    this.formActor.start();

  }

  defineComponent = (tag: string, module: CustomElementConstructor): void => {

    if (!customElements.get(tag)) { customElements.define(tag, module); }

  };

  validateStoreSelectionForm =
  async (context: FormContext<StoreSelectionContext>): Promise<FormValidatorResult[]> => {

    // only validate dirty fields
    const dirtyFields = Object.keys(context.data).filter((field) =>
      context.data[field]
    !== context.original[field]);

    const errors: FormValidatorResult[] = dirtyFields.map((field) => {

      const value = context.data[field];

      if (field === 'freeInput') {

        // the value must be a valid URL
        try {

          new URL(value);

        } catch {

          return { field, message: 'must be a valid URL of a solid pod' };

        }

      }

      return undefined;

    });

    return errors.filter((error) => error !== undefined);

  };

  clearFreeInput = (): void => {

    this.freeInput.value = '';
    this.formActor.send(new FormUpdatedEvent('freeInput', ''));

  };

  clearDropDown = (): void => {

    this.dropDown.value = 'empty';
    this.formActor.send(new FormUpdatedEvent('dropDown', 'empty'));

  };

  translator = { translate: (value: string): string => value };

  render(): TemplateResult {

    return html`
        <div id="content">
            <form-element-component .actor="${this.formActor}" .translator=${this.translator} field="dropDown">
                <select slot="input" name="dropDown" id="dropDown" required @input="${this.clearFreeInput}">
                    <option id="empty" value="empty" disabled selected hidden>Select a SemCom store ...</option>
                    ${this.semComStoreUrls.split(' ').map((store) => html`<option id="${store}" value="${store}">${store}</option>`)}
                </select>
            </form-element-component>

            <div id="or">
                <hr><p> or </p><hr>
            </div>

            <form-element-component .actor="${this.formActor}" .translator=${this.translator} field="freeInput">
              <label slot="label" for="freeInput">Manually provide a store</label>
              <input type="text" slot="input" placeholder="URI of the store ..." name="freeInput" id="freeInput" @input="${this.clearDropDown}" />
            </form-element-component>
            
            <button ?disabled="${(this.isValid && !this.isDirty) || (!this.isValid && this.isDirty) || (!this.isValid && !this.isDirty)}" type="button" @click="${() => this.formActor.send(new FormSubmittedEvent())}">Next</button>
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

        :host > * {
          width: 100%;
        }

        #or {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }

        #or hr {
          width: 30%;
        }

        p {
          margin: 0;
          padding: 0 var(--gap-small);
          text-align: center;
          flex: 0 0
        }

        #content > * {
          width: 100%;
          margin: var(--gap-large) 0 var(--gap-large) 0;
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

      `,
    ];

  }

}

export default SemComStoreSelectionComponent;

