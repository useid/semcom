import { html, css, CSSResult, TemplateResult, state, unsafeCSS, property } from 'lit-element';
import { RxLitElement } from 'rx-lit';
import { from } from 'rxjs';
import { createMachine, interpret, State } from 'xstate';
import { Theme } from '@useid/ui-transfer-theme';
import { AuthenticateComponent, FeedbackComponent, LoadingComponent, ProviderListComponent } from '@useid/ui-transfer-components';
import { FormElementComponent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { SolidSDKService } from '../services/solid-sdk.service';
import { semComRegisterMachine, SemComRegisterContext, SemComRegisterEvent, SemComRegisterState, SemComRegisterStates, AuthenticatedEvent, BackToStoreSelectionEvent, BackToUploadFormEvent, StoreSelectedEvent, UploadFormSubmittedEvent, NoPermissionEvent, DataNotSavedEvent } from './sem-com-register.machine';
import { SemComStoreSelectionComponent } from './sem-com-store-selection.component';
import { SemComUploadFormComponent } from './sem-com-upload-form.component';

/**
 * A LitElement WebComponent for registering SemCom components at a SemCom node.
 */
export class SemComRegisterComponent extends RxLitElement {

  private solidService = new SolidSDKService('SemCom');

  private machine = createMachine<SemComRegisterContext, SemComRegisterEvent, SemComRegisterState>(
    semComRegisterMachine
  );

  private actor = interpret(this.machine, { devTools: true });

  /** A space separated list of urls, each of which points to a SemCom store */
  @property({ type: String })
  public semComStoreUrls: string;

  @state()
  state: State<SemComRegisterContext>;

  /**
   * Creates a { SemComRegisterComponent }.
   */
  constructor() {

    super();

    this.defineComponent('auth-flow', AuthenticateComponent);
    this.defineComponent('provider-list', ProviderListComponent);
    this.defineComponent('loading-component', LoadingComponent);
    this.defineComponent('feedback-component', FeedbackComponent);
    this.defineComponent('sem-com-register-component', SemComRegisterComponent);
    this.defineComponent('sem-com-store-selection', SemComStoreSelectionComponent);
    this.defineComponent('sem-com-upload-form', SemComUploadFormComponent);
    this.defineComponent('form-element-component', FormElementComponent);

    this.subscribe('state', from(this.actor));

    this.actor.start();

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
   * Creates a new AuthenticationEvent for the specified event and sends it to the actor.
   *
   * @param { CustomEvent } event - The event to create an AuthenticationEvent for.
   */
  onAuthenticated = (event: CustomEvent): void => { this.actor.send(new AuthenticatedEvent(event.detail)); };

  /**
   * Creates a StoreSelectedEvent for the specified event and sends it to the actor.
   *
   * @param { StoreSelectedEvent } event - The event to create a StoreSelectedEvent for.
   */
  storeSelected = (event: CustomEvent): void => {

    this.actor.send(new StoreSelectedEvent(event.detail.input));

  };

  /**
   * Creates a UploadFormSubmittedEvent for the specified event and sends it to the actor.
   *
   * @param { UploadFormSubmittedEvent } event - The event to create an UploadFormSubmittedEvent for.
   */
  formUploaded = (event: CustomEvent): void => {

    this.actor.send(new UploadFormSubmittedEvent(event.detail));

  };

  /**
   * Renders the HTML of components based upon the current state.
   */
  render(): TemplateResult {

    let componentToRender = html``;

    if (this.state.matches(SemComRegisterStates.AUTHENTICATING)) {

      componentToRender = html`<auth-flow .solidService="${this.solidService}" @authenticated="${this.onAuthenticated}"></auth-flow>`;

    } else if (this.state.matches(SemComRegisterStates.STORE_SELECTION)) {

      componentToRender = html`<sem-com-store-selection @formSubmitted="${this.storeSelected}" semComStoreUrls="${this.semComStoreUrls}"></sem-com-store-selection>`;

    } else if (this.state.matches(SemComRegisterStates.CHECKING_PERMISSION)) {

      componentToRender = html`<loading-component message="Checking permissions..."></loading-component>`;

    } else if (this.state.matches(SemComRegisterStates.UPLOAD_COMPONENT_FORM)) {

      componentToRender = html`<sem-com-upload-form @formSubmitted="${this.formUploaded}"></sem-com-upload-form>`;

    } else if (this.state.matches(SemComRegisterStates.NOT_PERMITTED)) {

      const defaultError = 'You do not have permission to edit this store! Please choose another store or log in with a user account that has access to this store.';

      componentToRender = html`<feedback-component @feedback-component-click-event="${() => this.actor.send(new BackToStoreSelectionEvent())}" title="An error occured!" message="${this.state.event instanceof NoPermissionEvent ? this.state.event.errorMessage : defaultError}" buttonText="Go back to the store selection screen"></feedback-component>`;

    } else if (this.state.matches(SemComRegisterStates.UPLOADING_COMPONENT)) {

      componentToRender = html`<loading-component message="Saving data..."></loading-component>`;

    } else if (this.state.matches(SemComRegisterStates.SUCCESSFULLY_SAVED_DATA)) {

      componentToRender = html`<feedback-component @feedback-component-click-event="${() => this.actor.send(new BackToUploadFormEvent())}" success title="Data saved successfully!" buttonText="Add another component"></feedback-component>`;

    } else if (this.state.matches(SemComRegisterStates.ERROR_SAVING_DATA)) {

      const defaultError = 'Something went wrong while trying to save the data to the desired store. Please try again.';

      componentToRender = html`<feedback-component @feedback-component-click-event="${() => this.actor.send(new BackToStoreSelectionEvent())}" title="An error occurred!" message="${this.state.event instanceof DataNotSavedEvent ? this.state.event.errorMessage : defaultError}" buttonText="Go back to the store selection screen"></feedback-component>`;

    }

    return html`
      <div class="content">
        ${componentToRender}
      </div>
      `;

  }

  /**
   * Returns the CSS for the components.
   */
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
