import { Parser } from 'n3';
import { addListener, ComponentEventType, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import ProfileComponent from './components/profile.component';
import PayslipComponent from './components/payslip.component';
import InputComponent from './components/input.component';
import SemComRegisterComponent from './components/sem-com-register.component';
import GenderComponent from './components/gender.component';

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);
customElements.define('sem-com-register-component', SemComRegisterComponent);
customElements.define('gender-component', GenderComponent);

const parser = new Parser();

addListener(ComponentEventTypes.READ, document, async (event: ComponentReadEvent) => {

  const response = await fetch(event.detail.uri);
  const profileText = await response.text();
  const quads = parser.parse(profileText);

  return new ComponentResponseEvent({
    detail: { uri: event.detail.uri, cause: event, data: quads, success: true },
  });

});

addListener(ComponentEventTypes.WRITE, document, async (event: ComponentWriteEvent) => {

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
