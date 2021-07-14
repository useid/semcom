import { html, css, CSSResult, TemplateResult, state, PropertyValues, query, unsafeCSS } from 'lit-element';
import { createMachine, interpret, State } from 'xstate';
import { from } from 'rxjs';
import { RxLitElement } from 'rx-lit';
import { map } from 'rxjs/operators';
import { AuthenticateComponent, LoadingComponent, ProviderListComponent, ProviderListItemComponent, Session, SolidSDKService } from '@digita-ai/ui-transfer-components';
import { Theme } from '@digita-ai/ui-transfer-theme';
import { ComponentReadEvent, ComponentResponseEvent, addListener, ComponentEventTypes, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import { Parser } from 'n3';
import { fetch } from '@digita-ai/inrupt-solid-client';
import { demoMachine, DemoContext, DemoEvent, DemoState, DemoStates, AuthenticatedEvent } from './demo.machine';
import { SemComService } from './services/semcom.service';

export class DemoComponent extends RxLitElement {

  private solidService = new SolidSDKService('SemCom');

  private semComService: SemComService = new SemComService();

  private machine = createMachine<DemoContext, DemoEvent, DemoState>(demoMachine).withContext(
    { semComService: this.semComService }
  );

  // eslint-disable-next-line no-console -- state logger
  private actor = interpret(this.machine, { devTools: true }).onTransition((appState) => console.log(appState.value));

  @state()
  state: State<DemoContext>;

  @state()
  tags: string[];

  @state()
  session: Session;

  @query('.components')
  contentElement: HTMLDivElement;

  constructor() {

    super();

    this.define('auth-flow', AuthenticateComponent);
    this.define('loading-component', LoadingComponent);
    this.define('provider-list', ProviderListComponent);

    this.define('provider-list-item', ProviderListItemComponent);

    this.subscribe('state', from(this.actor));
    this.subscribe('session', from(this.actor).pipe(map((appState) => appState.context.session)));
    this.subscribe('tags', from(this.actor).pipe(map((appState) => appState.context.tags)));

    this.actor.start();

  }

  async updated(changed: PropertyValues): Promise<void> {

    super.updated(changed);

    if (changed && changed.has('tags') && this.actor) {

      for (const tag of this.tags) {

        const element = document.createElement(tag);

        const parser = new Parser();

        addListener(ComponentEventTypes.READ, element, async (event: ComponentReadEvent) => {

          const response = await fetch(event.detail.uri);
          const profileText = await response.text();
          const quads = parser.parse(profileText);

          return new ComponentResponseEvent({
            detail: { uri: event.detail.uri, cause: event, data: quads, success: true },
          });

        });

        addListener(ComponentEventTypes.WRITE, element, async (event: ComponentWriteEvent) => {

          try {

            new URL(event.detail.uri);

            const response = new Promise<ComponentResponseEvent>((resolve, reject) => {

              setTimeout(() =>
                resolve(new ComponentResponseEvent({
                  detail: { ...event.detail, cause: event, success: true },
                })), 2000);

            });

            return response;

          } catch(e) {

            return new ComponentResponseEvent({
              detail: { ...event.detail, cause: event, success: false },
            });

          }

        });

        this.contentElement.appendChild(element);

        element.setAttribute('entry', this.session.webId);

      }

    }

  }

  define(tag: string, module: CustomElementConstructor): void {

    if (!customElements.get(tag)) customElements.define(tag, module);

  }

  onAuthenticated = (event: CustomEvent): void => { this.actor.send(new AuthenticatedEvent(event.detail)); };

  render(): TemplateResult {

    return html`
    <div class="demo-content">
      <nav>
        <a class="link-item">
          <img class="logo" src="assets/img/Digita-White-NoText.png">
          <span class="title">SemCom Demo</span>
        </a>
      </nav>
      <div class="content">
        ${this.state.matches(DemoStates.AUTHENTICATING) ? html`<auth-flow .solidService="${this.solidService}" @authenticated="${this.onAuthenticated}"></auth-flow>` : html`` ? html`` : html`<loading-component></loading-component>`}
        ${this.tags ? html`<div class="components"></div>` : html`` ? html`` : html`<loading-component></loading-component>`}
      </div>
    </div>
    `;

  }

  static get styles(): CSSResult[] {

    return [
      unsafeCSS(Theme),
      css`
      .demo-content {
        display:flex;
        flex-direction: column;
        height: 100%;
        margin: 0 auto;
        width: var(--site-max-width);
        background-color: var(--color-background-root);
        box-shadow: 0px 0px 20px rgb(0 0 0 / 25%);
      }
      
      nav {
        background-color: #2b4c7f !important;
        margin-bottom: 1.5rem;
        height: 100px;
      }

      nav a {
        display:flex;
        justify-content: flex-start;
        align-items:center;
      }

      .logo {
        max-width: 100px;
        max-height: 100%;
      }

      .title {
        color: white;
        font-size: 14;
        font-weight: 400;
      }

      .content {
        display:flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
      }

      .content > * {
        margin: 100px;
      }
      `,
    ];

  }

}
