import { PayslipComponent } from './components/payslip';
import { ProfileComponent } from './components/profile';

// mock registration service

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
    'payslip-component': PayslipComponent;
  }
}

let temp = await fetch('./testdata/profile.txt');
const profileFile: string = await temp.text();
const mockFetchProfile = () => Promise.resolve(new Response(profileFile));

temp = await fetch('./testdata/singlePayslip.txt');
const payslipFile: string = await temp.text();
const mockFetchPayslip = () => Promise.resolve(new Response(payslipFile));


// client app

const profile = document.createElement('profile-component');
const payslip = document.createElement('payslip-component');

profile.data('i-dont-matter', mockFetchProfile);
payslip.data('i-dont-matter', mockFetchPayslip);

document.body.appendChild(profile);
document.body.appendChild(payslip);

// exports

export * from './components/profile';
export * from './components/payslip';
