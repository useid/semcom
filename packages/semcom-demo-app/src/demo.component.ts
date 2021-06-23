import { html, css, CSSResult, TemplateResult, state } from 'lit-element';
import { createMachine, interpret, State } from 'xstate';
import { from } from 'rxjs';
import { RxLitElement } from 'rx-lit';
import { map } from 'rxjs/operators';
import { Purpose, Source, SourceListComponent, ConsentRequestComponent, ConsentResultComponent, AuthenticateComponent, LoadingComponent, ProviderListComponent, ProviderListItemComponent } from '@digita-ai/ui-transfer-components';
import { demoMachine, DemoContext, DemoEvent, DemoState, DemoStates, AuthenticatedEvent, ConsentGivenEvent, SourceSelectedEvent } from './demo.machine';
import { SemComService } from './services/semcom.service';

export class DemoComponent extends RxLitElement {

  private semComService: SemComService = new SemComService();

  private machine = createMachine<DemoContext, DemoEvent, DemoState>(demoMachine).withContext(
    { semComService: this.semComService }
  );

  // eslint-disable-next-line no-console -- state logger
  private actor = interpret(this.machine, { devTools: true }).onTransition((appState) => console.log(appState.value));

  @state()
  state: State<DemoContext>;

  @state()
  sources: Source[];

  @state()
  purpose: Purpose;

  constructor() {

    super();

    this.define('source-list', SourceListComponent);
    this.define('consent-request', ConsentRequestComponent);
    this.define('consent-result', ConsentResultComponent);
    this.define('auth-flow', AuthenticateComponent);
    this.define('loading-component', LoadingComponent);
    this.define('provider-list', ProviderListComponent);
    this.define('provider-list-item', ProviderListItemComponent);

    this.subscribe('state', from(this.actor));
    this.subscribe('sources', from(this.actor).pipe(map((appState) => appState.context.sources)));
    this.subscribe('purpose', from(this.actor).pipe(map((appState) => appState.context.purpose)));

    this.actor.start();

  }

  define(tag: string, module: CustomElementConstructor): void {

    if (!customElements.get(tag)) customElements.define(tag, module);

  }

  onAuthenticated = (event: CustomEvent): void => { this.actor.send(new AuthenticatedEvent(event.detail)); };
  onConsent = (): void => { this.actor.send(new ConsentGivenEvent()); };
  onSourceSelected = (event: CustomEvent): void => { this.actor.send(new SourceSelectedEvent(event.detail)); };
  onDone = (): void => { window.alert('This is a demo. Nowhere to go...'); };

  render(): TemplateResult {

    this.state.matches(DemoStates.AUTHENTICATING);
    this.state.matches(DemoStates.LOADING_INVITE);
    this.state.matches(DemoStates.AWAITING_CONSENT);
    this.state.matches(DemoStates.LOADING_SOURCES);
    this.state.matches(DemoStates.AWAITING_SOURCE_SELECTION);
    this.state.matches(DemoStates.CONNECTING);
    this.state.matches(DemoStates.CALLBACK);

    return html``;

  }

  static get styles(): CSSResult[] {

    return [
      css``,
    ];

  }

}
