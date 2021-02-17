import { ProfileComponent } from './components/profile';

// register service
customElements.define('profile-component', ProfileComponent);

declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
  }
}

// client app

const profile = document.createElement('profile-component');

profile.setData('Stijn');

document.body.appendChild(profile);




export * from './components/profile';
