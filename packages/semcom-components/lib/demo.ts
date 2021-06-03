import { Parser } from 'n3';
import { ComponentEventType, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import ProfileComponent from './components/profile.component';
import PayslipComponent from './components/payslip.component';
import InputComponent from './components/input.component';

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);

const parser = new Parser();

document.addEventListener(ComponentEventType.READ, (event: ComponentReadEvent) => {

  if (!event || !event.detail || !event.detail.uri) {

    throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

  }

  fetch(event.detail.uri).then((response) => response.text().then((profileText) => {

    const quads = parser.parse(profileText);

    event.target?.dispatchEvent(new ComponentResponseEvent({
      detail: { uri: event.detail.uri, cause: event, data: quads, success: true },
    }));

  }));

});

document.addEventListener(ComponentEventType.WRITE, (event: ComponentWriteEvent) => {

  if (!event || !event.detail || !event.detail.uri) {

    throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

  }

  setTimeout(() => event.target?.dispatchEvent(new ComponentResponseEvent({
    detail: { ...event.detail, cause: event, success: true },
  })), 2000);

});
