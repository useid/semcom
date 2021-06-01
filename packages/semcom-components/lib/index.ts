import * as N3 from 'n3';
import { BaseComponentEvent, ReadEvent, ResponseEvent } from './components/base-component-events.model';
import ProfileComponent from './components/profile';

customElements.define('profile-component', ProfileComponent);

// declare global {
//   interface HTMLElementTagNameMap {
//     'profile-component': ProfileComponent;
//   }
// }

const parser = new N3.Parser();

document.addEventListener(BaseComponentEvent.READ, (event: ReadEvent) => {

  fetch('./testdata/profile.txt').then((response) => response.text().then((profileText) => {

    const quads = parser.parse(profileText);
    event.target.dispatchEvent(new ResponseEvent({ detail: { quads } }));
    // if nested components are used, event.target should be event.composedPath[0], but this only works with open shadow roots (like litelement)

  }));

});

// const profile = document.createElement('profile-component');
// profile.setAttribute('entry', 'http://example.com');
// document.body.appendChild(profile);

export * from './components/profile';
export * from './components/payslip';
