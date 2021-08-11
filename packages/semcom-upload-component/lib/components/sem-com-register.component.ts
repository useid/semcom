import { html, css, CSSResult, TemplateResult, state, unsafeCSS, query } from 'lit-element';
import { RxLitElement } from 'rx-lit';
import { from } from 'rxjs';
import { createMachine, interpret, State } from 'xstate';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { SolidSDKService } from '../services/solid-sdk.service';
import { semComRegisterMachine, SemComRegisterContext, SemComRegisterEvent, SemComRegisterState, SemComRegisterStates, AuthenticatedEvent, BackToStoreSelectionEvent, BackToUploadFormEvent, StoreSelectedEvent, UploadFormSubmittedEvent } from './sem-com-register.machine';

export class SemComRegisterComponent extends RxLitElement {

  private solidService = new SolidSDKService('SemCom');

  private machine = createMachine<SemComRegisterContext, SemComRegisterEvent, SemComRegisterState>(
    semComRegisterMachine
  );

  private actor = interpret(this.machine, { devTools: true });

  @state()
  state: State<SemComRegisterContext>;

  @query('#test')
  test: HTMLElement;

  constructor() {

    super();

    this.subscribe('state', from(this.actor));

    this.actor.start();

  }

  onAuthenticated = (event: CustomEvent): void => { this.actor.send(new AuthenticatedEvent(event.detail)); };

  render(): TemplateResult {

    let componentToRender = html``;

    if (this.state.matches(SemComRegisterStates.AUTHENTICATING)) {

      componentToRender = html`<auth-flow .solidService="${this.solidService}" @authenticated="${this.onAuthenticated}"></auth-flow>`;

    } else if (this.state.matches(SemComRegisterStates.STORE_SELECTION)) {

      componentToRender = html`<sem-com-store-selection @formSubmitted="${this.storeSelected}" .semComStoreUrls="${[ 'http://localhost:3002/testpod1/', 'http://localhost:3002/testpod2/' ]}"></sem-com-store-selection>`;

    } else if (this.state.matches(SemComRegisterStates.CHECKING_PERMISSION)) {

      componentToRender = html`<loading-component message="Checking permissions..."></loading-component>`;

    } else if (this.state.matches(SemComRegisterStates.UPLOAD_COMPONENT_FORM)) {

      componentToRender = html`<sem-com-upload-form @formSubmitted="${this.formUploaded}"></sem-com-upload-form>`;

    } else if (this.state.matches(SemComRegisterStates.NOT_PERMITTED)) {

      componentToRender = html`<feedback-component @feedback-component-click-event="${() => this.actor.send(new BackToStoreSelectionEvent())}" title="An error occured!" message="You do not have permission to edit this store! Please choose another store or log in with a user account that has access to this store." buttonText="Go back to the store selection screen"></feedback-component>`;

    } else if (this.state.matches(SemComRegisterStates.UPLOADING_COMPONENT)) {

      componentToRender = html`<loading-component message="Saving data..."></loading-component>`;

    } else if (this.state.matches(SemComRegisterStates.SUCCESSFULLY_SAVED_DATA)) {

      componentToRender = html`<feedback-component @feedback-component-click-event="${() => this.actor.send(new BackToUploadFormEvent())}" success title="Data saved successfully!" buttonText="Add another component"></feedback-component>`;

    } else if (this.state.matches(SemComRegisterStates.ERROR_SAVING_DATA)) {

      componentToRender = html`<feedback-component @feedback-component-click-event="${() => this.actor.send(new BackToStoreSelectionEvent())}" title="An error occurred!" message="Something went wrong while trying to save the data to the desired store. Please try again." buttonText="Go back to the store selection screen"></feedback-component>`;

    }

    return html`
        <div class="content">
          ${componentToRender}
        </div>
        `;

  }

  storeSelected = (event: CustomEvent): void => {

    this.actor.send(new StoreSelectedEvent(event.detail.dropDown, event.detail.freeInput));

  };

  formUploaded = (event: CustomEvent): void => {

    this.actor.send(new UploadFormSubmittedEvent(
      {
        uri: event.detail.uri,
        labelInput: event.detail.labelInput,
        description: event.detail.description,
        author: event.detail.author,
        tag:event.detail.tag,
        shapes: event.detail.shapes,
        version: event.detail.version,
        latest: event.detail.latest,
        checksum: event.detail.checksum,
      }
    ));

  };

  addEventListenerAfterUpdate = async (id: string, callback: () => void): Promise<void> => {

    await this.updateComplete;
    const element = this.shadowRoot.querySelector('#' + id);
    element.addEventListener('feedback-component-click-event', callback);

  };

  static get styles(): CSSResult[] {

    return [
      unsafeCSS(Theme),

      css`

        .content {
          padding: var(--gap-large)
        }

      `,
    ];

  }

}
export default SemComRegisterComponent;
