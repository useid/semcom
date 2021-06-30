import { html, css, CSSResult, TemplateResult, state } from 'lit-element';
import { createMachine, interpret, State } from 'xstate';
import { from } from 'rxjs';
import { RxLitElement } from 'rx-lit';
import { map } from 'rxjs/operators';
import { Purpose, Source, AuthenticateComponent, LoadingComponent, ProviderListComponent, ProviderListItemComponent, SolidSDKService } from '@digita-ai/ui-transfer-components';
import { demoMachine, DemoContext, DemoEvent, DemoState, DemoStates, AuthenticatedEvent } from './demo.machine';
import { SemComService } from './services/semcom.service';

export class DemoComponent extends RxLitElement {

  private solidService = new SolidSDKService('SemCom');

  private semComService: SemComService = new SemComService();

  private machine = createMachine<DemoContext, DemoEvent, DemoState>(demoMachine).withContext(
    { semComService: this.semComService }
  );

  // eslint-disable-next-line no-console -- state logger
  private actor = interpret(this.machine, { devTools: true }).onTransition((appState) => console.log(appState.event));

  @state()
  state: State<DemoContext>;

  @state()
  sources: Source[];

  @state()
  purpose: Purpose;

  @state()
  tags: string[];

  constructor() {

    super();

    this.define('auth-flow', AuthenticateComponent);
    this.define('loading-component', LoadingComponent);
    this.define('provider-list', ProviderListComponent);

    this.define('provider-list-item', ProviderListItemComponent);

    this.subscribe('state', from(this.actor));
    this.subscribe('purpose', from(this.actor).pipe(map((appState) => appState.context.purpose)));
    this.subscribe('tags', from(this.actor).pipe(map((appState) => appState.context.tags)));

    this.actor.start();

  }

  define(tag: string, module: CustomElementConstructor): void {

    if (!customElements.get(tag)) customElements.define(tag, module);

  }

  onAuthenticated = (event: CustomEvent): void => { this.actor.send(new AuthenticatedEvent(event.detail)); };
  onDone = (): void => { window.alert('This is a demo. Nowhere to go...'); };

  render(): TemplateResult {

    this.state.matches(DemoStates.AUTHENTICATING);

    return html`
    ${
  this.state.matches(DemoStates.AUTHENTICATING)
    ? html`<auth-flow .solidService="${this.solidService}" @authenticated="${this.onAuthenticated}"></auth-flow>` : html``
      ? html`` : html`<loading-component></loading-component>`
}`;

  }

  static get styles(): CSSResult[] {

    return [
      css``,
    ];

  }

}
