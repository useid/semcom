import * as N3 from 'n3';
import { ComponentEventType, ComponentReadEvent, ComponentResponseEvent } from '@digita-ai/semcom-sdk';
import ProfileComponent from './components/profile';

customElements.define('profile-component', ProfileComponent);

const parser = new N3.Parser();

document.addEventListener(ComponentEventType.READ, (event: ComponentReadEvent) => {

  fetch('./testdata/profile.txt').then((response) => response.text().then((profileText) => {

    const quads = parser.parse(profileText);
    event.target.dispatchEvent(new ComponentResponseEvent({ detail: { uri: './testdata/profile.txt', cause: event, data: quads } }));
    // if nested components are used, event.target should be event.composedPath[0], but this only works with open shadow roots (like litelement)

  }));

});

export * from './components/profile';
export * from './components/payslip';
