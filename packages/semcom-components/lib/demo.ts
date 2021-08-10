import { Parser } from 'n3';
import { addListener } from '@digita-ai/semcom-sdk';
import { ComponentEventType, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-core';
import ProfileComponent from './components/profile.component';
import PayslipComponent from './components/payslip.component';
import InputComponent from './components/input.component';
import GenderComponent from './components/gender.component';

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);
customElements.define('gender-component', GenderComponent);

const parser = new Parser();

addListener(ComponentEventTypes.READ, 'quads', document, async (event: ComponentReadEvent<'quads'>) => {

  const response = await fetch(event.detail.uri);
  const profileText = await response.text();
  const quads = parser.parse(profileText);

  return new ComponentResponseEvent({
    detail: { uri: event.detail.uri, cause: event, data: quads, success: true, type: 'quads' },
  });

});

addListener(ComponentEventTypes.WRITE, 'quads', document, async (event: ComponentWriteEvent<'quads'>) => {

  try {

    new URL(event.detail.uri);

    const response = new Promise<ComponentResponseEvent<'quads'>>((resolve, reject) => {

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
