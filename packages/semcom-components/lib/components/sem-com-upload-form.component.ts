import { html, unsafeCSS, css, CSSResult, TemplateResult, property, PropertyValues, state } from 'lit-element';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { RxLitElement } from 'rx-lit';
import { ActorRef, Interpreter } from 'xstate';
import { FormActors, FormCleanlinessStates, FormEvent, FormRootStates, FormSubmissionStates, FormValidationStates, FormEvents } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SemComRegisterContext } from './sem-com-register.machine';

export class SemComUploadFormComponent extends RxLitElement {

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

    return html`
      <div id="content">
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
        <button ?disabled="${false}" type="button" @click="${() => this.formActor.send(FormEvents.FORM_SUBMITTED)}">Save Data</button>
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

      `,
    ];

  }

}

export default SemComUploadFormComponent;

