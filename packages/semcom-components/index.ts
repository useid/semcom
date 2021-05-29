import * as N3 from 'n3';
// import PayslipComponent from './components/payslip';
// import ProfileComponent from './components/profile';
import ProfileEventComponent from './components/profile_events';

// customElements.define('profile-component', ProfileComponent);
customElements.define('profile-event-component', ProfileEventComponent);
// customElements.define('payslip-component', PayslipComponent);
declare global {
  interface HTMLElementTagNameMap {
    // 'profile-component': ProfileComponent;
    'profile-event-component': ProfileEventComponent;
    // 'payslip-component': PayslipComponent;
  }
}

const parser = new N3.Parser();

document.addEventListener('semcom-data-request', (event: CustomEvent & { detail: { uri: string } }) => {

  console.log(event);

  fetch('./testdata/profile.txt').then((response) => response.text().then((profileText) => {

    const quads = parser.parse(profileText);
    event.target.dispatchEvent(new CustomEvent('semcom-data-response', { detail: quads }));
    // if nested components are used, event.target should be event.composedPath[0], but this only works with open shadow roots (like litelement)

  }));

});

const event_profile = document.createElement('profile-event-component');
event_profile.setAttribute('entry', 'http://example.com');
document.body.appendChild(event_profile);

// fetch('./testdata/profile.txt').then((response) => {

//   response.text().then((profileFile) => {

//     const mockFetchProfile = () => Promise.resolve(new Response(profileFile));
//     const profile = document.createElement('profile-component');
//     profile.data('i-dont-matter', mockFetchProfile);
//     document.body.appendChild(profile);

//   });

// });

// fetch('./testdata/singlePayslip.txt').then((response) => {

//   response.text().then((payslipFile) => {

//     const mockFetchPayslip = () => Promise.resolve(new Response(payslipFile));
//     const payslip = document.createElement('payslip-component');
//     payslip.data('i-dont-matter', mockFetchPayslip);
//     document.body.appendChild(payslip);

//   });

// });

export * from './components/profile';
export * from './components/payslip';
