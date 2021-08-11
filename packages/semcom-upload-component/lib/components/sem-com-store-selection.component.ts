import { html, unsafeCSS, css, CSSResult, TemplateResult, property, PropertyValues, state, query } from 'lit-element';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { RxLitElement } from 'rx-lit';
import { ActorRef, Interpreter } from 'xstate';
import { FormActors, FormCleanlinessStates, FormEvent, FormRootStates, FormSubmissionStates, FormValidationStates, FormEvents, FormUpdatedEvent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SemComRegisterContext } from './sem-com-register.machine';

export class SemComStoreSelectionComponent extends RxLitElement {

  @property({ type: Array })
  public semComStoreUrls: string[];

  /** The actor controlling this component. */
  @property({ type: Object })
  public actor: Interpreter<SemComRegisterContext>;

  /** The actor responsible for form validation in this component.  */
  @state()
  formActor: ActorRef<FormEvent>;

  /** Indicates if if the form validation passed. */
  @state()
  isValid? = false;

  /** Indicates if one of the form fields has changed. */
  @state()
  isDirty? = false;

  /** The freeInput element from the DOM */
  @query('#freeInput')
  freeInput: HTMLInputElement;

  /** The dropDown element from the DOM */
  @query('#dropDown')
  dropDown: HTMLSelectElement;

  /** Hook called on at every update after connection to the DOM. */
  async updated(changed: PropertyValues): Promise<void> {

    super.updated(changed);

    if (changed && changed.has('actor') && this.actor) {

      this.subscribe('formActor', from(this.actor).pipe(
        map((machineState) => machineState.children[FormActors.FORM_MACHINE]),
      ));

    }

    if(changed?.has('formActor') && this.formActor){

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

    }

  }

  render(): TemplateResult {

    const clearFreeInput = () => {

      this.freeInput.value = '';
      this.formActor.send(new FormUpdatedEvent('freeInput', ''));

    };

    const clearDropDown = () => {

      this.dropDown.value = 'empty';
      this.formActor.send(new FormUpdatedEvent('dropDown', 'empty'));

    };

    return html`
        <div id="content">
            <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="dropDown">
                <select slot="input" name="dropDown" id="dropDown" required @input="${clearFreeInput}">
                    <option id="empty" value="empty" disabled selected hidden>Select a SemCom store ...</option>
                    ${this.semComStoreUrls.map((store) => html`<option id="${store}" value="${store}">${store}</option>`)}
                </select>
            </form-element-component>

            <div id="or">
                <hr><p> or </p><hr>
            </div>

            <form-element-component .actor="${this.formActor}" .translator=${{ translate: (value: string) => value }} field="freeInput">
              <label slot="label" for="freeInput">Manually provide a store</label>
              <input type="text" slot="input" placeholder="URI of the store ..." name="freeInput" id="freeInput" @input="${clearDropDown}" />
            </form-element-component>
            <!-- UPGRADE THIS TO new FormSubmittedEvent() WHEN THE TYPE IS FIXED -->
            <button ?disabled="${(this.isValid && !this.isDirty) || (!this.isValid && this.isDirty) || (!this.isValid && !this.isDirty)}" type="button" @click="${() => this.formActor.send(FormEvents.FORM_SUBMITTED)}">Next</button>
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

