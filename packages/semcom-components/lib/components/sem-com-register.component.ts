import { html, css, CSSResult, TemplateResult, state, unsafeCSS, query } from 'lit-element';
import { RxLitElement } from 'rx-lit';
import { from, Observable, ObservableInput } from 'rxjs';
import { createMachine, interpret, State } from 'xstate';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { SolidSDKService } from '@digita-ai/ui-transfer-components';
import { semComRegisterMachine, SemComRegisterContext, SemComRegisterEvent, SemComRegisterState, SemComRegisterStates, AuthenticatedEvent, BackToStoreSelectionEvent, BackToUploadFormEvent } from './sem-com-register.machine';

export class SemComRegisterComponent extends RxLitElement {

  private solidService = new SolidSDKService('SemCom');

  private machine = createMachine<SemComRegisterContext, SemComRegisterEvent, SemComRegisterState>(
    semComRegisterMachine
  );

  // Should not be an any - due to ts strict mode.
  private actor: any = interpret(this.machine, { devTools: true })
    // eslint-disable-next-line no-console -- this is a state logger
    .onTransition((appState) => console.log(appState.value));

  @state()
  state?: State<SemComRegisterContext>;

  @query('#test')
  test?: HTMLElement;

  constructor() {

    super();

    // Should not be cast - due to ts strict mode.
    this.subscribe('state', from(this.actor) as Observable<State<SemComRegisterContext>>);

    this.actor.start();

  }

  onAuthenticated = (event: CustomEvent): void => { this.actor.send(new AuthenticatedEvent(event.detail)); };

  render(): TemplateResult {

    let componentToRender = html``;

    if (this.state && this.state.matches(SemComRegisterStates.AUTHENTICATING)) {

      componentToRender = html`<auth-flow .solidService="${this.solidService}" @authenticated="${this.onAuthenticated}"></auth-flow>`;

    } else if (this.state && this.state.matches(SemComRegisterStates.STORE_SELECTION)) {

      componentToRender = html`<sem-com-store-selection .actor="${this.actor}" .semComStoreUrls="${[ 'http://localhost:3002/testpod1/', 'http://localhost:3002/testpod2/' ]}"></sem-com-store-selection>`;

    } else if (this.state && this.state.matches(SemComRegisterStates.CHECKING_PERMISSION)) {

      componentToRender = html`<loading-component message="Checking permissions..."></loading-component>`;

    } else if (this.state && this.state.matches(SemComRegisterStates.UPLOAD_COMPONENT_FORM)) {

      componentToRender = html`<sem-com-upload-form .actor="${this.actor}"></sem-com-upload-form>`;

    } else if (this.state && this.state.matches(SemComRegisterStates.NOT_PERMITTED)) {

      componentToRender = html`<feedback-component id="fc-store-selection-error" title="An error occured!" message="You do not have permission to edit this store! Please choose another store or log in with a user account that has access to this store." buttonText="Go back to the store selection screen"></feedback-component>`;
      this.addEventListenerAfterUpdate('fc-store-selection-error', () => this.actor.send(new BackToStoreSelectionEvent()));

    } else if (this.state && this.state.matches(SemComRegisterStates.UPLOADING_COMPONENT)) {

      componentToRender = html`<loading-component message="Saving data..."></loading-component>`;

    } else if (this.state && this.state.matches(SemComRegisterStates.SUCCESSFULLY_SAVED_DATA)) {

      componentToRender = html`<feedback-component id="fc-upload-successful" success title="Data saved successfully!" buttonText="Add another component"></feedback-component>`;
      this.addEventListenerAfterUpdate('fc-upload-successful', () => this.actor.send(new BackToUploadFormEvent()));

    } else if (this.state && this.state.matches(SemComRegisterStates.ERROR_SAVING_DATA)) {

      componentToRender = html`<feedback-component id="fc-error-saving-data" title="An error occurred!" message="Something went wrong while trying to save the data to the desired store. Please try again." buttonText="Go back to the store selection screen"></feedback-component>`;
      this.addEventListenerAfterUpdate('fc-error-saving-data', () => this.actor.send(new BackToStoreSelectionEvent()));

    }

    return html`
        <div class="root-content">
          <nav>
            <a class="link-item">
              <img class="logo" src="logo-here.png">
              <span class="title">title</span>
            </a>
          </nav>
          <div class="content" id="test">
            ${componentToRender} 
          </div>
        </div>
        `;

  }

  addEventListenerAfterUpdate = async (id: string, callback: () => void): Promise<void> => {

    await this.updateComplete;
    const element = this.shadowRoot?.querySelector('#' + id);
    element?.addEventListener('feedback-component-click-event', callback);

  };

  static get styles(): CSSResult[] {

    return [
      unsafeCSS(Theme),

      css`

        .content {
          padding: var(--gap-large);
        }

      `,
    ];

  }

}
export default SemComRegisterComponent;
