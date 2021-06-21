import { html, internalProperty, unsafeCSS, css, CSSResult, TemplateResult } from 'lit-element';
import { createMachine, interpret, State } from 'xstate';
import { from } from 'rxjs';
import { RxLitElement } from 'rx-lit';
import { map } from 'rxjs/operators';
import { demoMachine, DemoContext, DemoEvent, DemoState, DemoStates, AuthenticatedEvent, ConsentGivenEvent, SourceSelectedEvent } from './demo.machine';

export class DemoComponent extends RxLitElement {

  private machine = createMachine<DemoContext, DemoEvent, DemoState>(demoMachine).withContext({});

  // eslint-disable-next-line no-console -- state logger
  private actor = interpret(this.machine, { devTools: true }).onTransition((state) => console.log(state.value));
  
  @internalProperty()
  state: State<DemoContext>;

  constructor() {

    super();


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
