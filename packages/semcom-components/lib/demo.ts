import { Parser } from 'n3';
import { ComponentEventType, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-core';
import PayslipComponent from './components/payslip.component';
import InputComponent from './components/input.component';
import ProfileComponent from './components/profile.component';

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);

const parser = new Parser();

document.addEventListener(ComponentEventType.READ, (event: ComponentReadEvent) => {

  if (!event || !event.detail || !event.detail.uri) {

    throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

  }

  fetch(event.detail.uri).then((response) => response.text().then((profileText) => {

    const target = event.target;

    event.stopPropagation();

    const quads = parser.parse(profileText);

    target?.dispatchEvent(new ComponentResponseEvent({
      detail: { uri: event.detail.uri, cause: event, data: quads, success: true },
    }));

  }));

});

document.addEventListener(ComponentEventType.WRITE, (event: ComponentWriteEvent) => {

  const target = event.target;

  event.stopPropagation();

  if (!event || !event.detail || !event.detail.uri) {

    throw new Error('Argument event || !event.detail || !event.detail.uri should be set.');

  }

  try {

    new URL(event.detail.uri);

    setTimeout(() => target?.dispatchEvent(new ComponentResponseEvent({
      detail: { ...event.detail, cause: event, success: true },
    })), 2000);

  } catch(e) {

    target?.dispatchEvent(new ComponentResponseEvent({
      detail: { ...event.detail, cause: event, success: false },
    }));

  }

});
